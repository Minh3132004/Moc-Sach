package com.example.backend.service.order;

import com.example.backend.dao.order.OrderRepository;
import com.example.backend.dao.order.DeliveryRepository;
import com.example.backend.dao.coupon.CouponRepository;
import com.example.backend.dao.user.UserRepository;
import com.example.backend.dao.order.OrderDetailRepository;
import com.example.backend.dao.payment.PaymentRepository;
import com.example.backend.dao.cart.CartItemRepository;
import com.example.backend.dao.book.BookRepository;
import com.example.backend.dto.request.order.CreateOrderRequest;
import com.example.backend.dto.request.order.UpdateOrderRequest;
import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.entity.coupon.Coupon;
import com.example.backend.entity.order.Delivery;
import com.example.backend.entity.payment.Payment;
import com.example.backend.entity.book.Book;
import com.example.backend.entity.order.OrderDetail;
import com.example.backend.entity.user.User;
import com.example.backend.entity.order.Order;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Service
public class OrderServiceImp implements OrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Override
        @Transactional
        public ResponseEntity<?> save(CreateOrderRequest orderDTO) {
        User user = userRepository.findById(orderDTO.getIdUser())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));
        Payment payment = paymentRepository.findById(orderDTO.getIdPayment())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy phương thức thanh toán"));
        Delivery delivery = deliveryRepository.findById(orderDTO.getIdDelivery())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy phương thức giao hàng"));

        Coupon coupon = null;
        if (orderDTO.getCouponCode() != null && !orderDTO.getCouponCode().trim().isEmpty()) {
            coupon = couponRepository.findByCode(orderDTO.getCouponCode().trim())
                    .orElseThrow(() -> new NotFoundException("Mã giảm giá không tồn tại"));

            LocalDate today = LocalDate.now();
            if (!coupon.isActive() || coupon.getExpiryDate().before(Date.valueOf(today))) {
                throw new BadRequestException("Mã giảm giá không hợp lệ hoặc đã hết hạn");
            }
        }

        if (orderDTO.getOrderItems() == null || orderDTO.getOrderItems().isEmpty()) {
            throw new BadRequestException("Danh sách sách không được trống");
        }

        for (CreateOrderRequest.OrderItemRequest item : orderDTO.getOrderItems()) {
            Book book = bookRepository.findById(item.getIdBook())
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy sách với ID: " + item.getIdBook()));

            if (book.getQuantity() < item.getQuantity()) {
                throw new BadRequestException("Số lượng sách không đủ");
            }
        }

        Order order = new Order();
        LocalDate localDate = LocalDate.now();
        order.setDateCreated(Date.valueOf(localDate));
        order.setDeliveryAddress(orderDTO.getDeliveryAddress());
        order.setPhoneNumber(orderDTO.getPhoneNumber());
        order.setFullName(orderDTO.getFullName());
        order.setTotalPriceProduct(orderDTO.getTotalPriceProduct());
        order.setFeeDelivery(delivery.getFeeDelivery());
        order.setFeePayment(payment.getFeePayment());
        order.setTotalPrice(orderDTO.getTotalPrice());
        order.setNote(orderDTO.getNote());
        order.setUser(user);
        order.setPayment(payment);
        order.setDelivery(delivery);
        order.setCoupon(coupon);
        order.setStatus("Đang xử lý");
        order.setPaymentStatus(orderDTO.getPaymentStatus());

        Order savedOrder = orderRepository.save(order);

        for (CreateOrderRequest.OrderItemRequest item : orderDTO.getOrderItems()) {
            Book book = bookRepository.findById(item.getIdBook())
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy sách với ID: " + item.getIdBook()));

            book.setQuantity(book.getQuantity() - item.getQuantity());
            book.setSoldQuantity(book.getSoldQuantity() + item.getQuantity());
            bookRepository.save(book);

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setQuantity(item.getQuantity());
            orderDetail.setPrice(book.getSellPrice());
            orderDetail.setBook(book);
            orderDetail.setOrder(savedOrder);
            orderDetailRepository.save(orderDetail);
        }

        cartItemRepository.deleteByUser_IdUser(orderDTO.getIdUser());
        return ResponseEntity.ok(ApiResponse.success("Đơn hàng đã được tạo thành công!", null));
    }

    @Override
    @Transactional
    public ResponseEntity<?> update(UpdateOrderRequest orderDTO) {
        Order order = orderRepository.findById(orderDTO.getIdOrder())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng"));

        if ("Bị huỷ".equalsIgnoreCase(orderDTO.getStatus())
                && !"Bị huỷ".equalsIgnoreCase(order.getStatus())) {
            List<OrderDetail> orderDetails = orderDetailRepository.findOrderDetailsByOrder(order);
            for (OrderDetail detail : orderDetails) {
                Book book = detail.getBook();
                if (book != null) {
                    book.setQuantity(book.getQuantity() + detail.getQuantity());
                    book.setSoldQuantity(Math.max(0, book.getSoldQuantity() - detail.getQuantity()));
                    bookRepository.save(book);
                }
            }
        }

        order.setStatus(orderDTO.getStatus());
        orderRepository.save(order);
        return ResponseEntity.ok(ApiResponse.success("Đơn hàng đã được cập nhật thành công", null));
    }
}
