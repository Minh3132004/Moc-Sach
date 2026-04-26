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
import com.example.backend.dto.response.order.OrderDetailResponse;
import com.example.backend.dto.response.order.OrderResponse;
import com.example.backend.entity.coupon.Coupon;
import com.example.backend.entity.order.Delivery;
import com.example.backend.entity.payment.Payment;
import com.example.backend.entity.book.Book;
import com.example.backend.entity.order.OrderDetail;
import com.example.backend.entity.user.User;
import com.example.backend.entity.order.Order;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.InternalServerException;
import com.example.backend.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
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

    // Tạo đơn hàng
    @Override
    @Transactional
    public ResponseEntity<?> save(CreateOrderRequest orderDTO) {
        try {
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

            List<Book> booksToUpdate = new ArrayList<>();
            for (CreateOrderRequest.OrderItemRequest item : orderDTO.getOrderItems()) {
                Book book = bookRepository.findById(item.getIdBook())
                        .orElseThrow(() -> new NotFoundException("Không tìm thấy sách với ID: " + item.getIdBook()));

                if (book.getQuantity() < item.getQuantity()) {
                    throw new BadRequestException("Số lượng sách không đủ");
                }
                booksToUpdate.add(book);
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

            List<OrderDetail> savedOrderDetails = new ArrayList<>();
            for (int i = 0; i < orderDTO.getOrderItems().size(); i++) {
                CreateOrderRequest.OrderItemRequest item = orderDTO.getOrderItems().get(i);
                Book book = booksToUpdate.get(i);

                book.setQuantity(book.getQuantity() - item.getQuantity());
                book.setSoldQuantity(book.getSoldQuantity() + item.getQuantity());
                bookRepository.save(book);

                OrderDetail orderDetail = new OrderDetail();
                orderDetail.setQuantity(item.getQuantity());
                orderDetail.setPrice(book.getSellPrice());
                orderDetail.setReview(false);
                orderDetail.setBook(book);
                orderDetail.setOrder(savedOrder);
                savedOrderDetails.add(orderDetailRepository.save(orderDetail));
            }

            cartItemRepository.deleteByUser_IdUser(orderDTO.getIdUser());

            return ResponseEntity.ok(ApiResponse.success("Đơn hàng đã được tạo thành công!", mapToOrderResponse(savedOrder, savedOrderDetails)));
        } catch (BadRequestException | NotFoundException e) {
            throw e;
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Tạo đơn hàng thất bại do dữ liệu xung đột");
        } catch (Exception e) {
            throw new InternalServerException("Tạo đơn hàng thất bại", e);
        }
    }

    //Cập nhật đơn hàng
    @Override
    @Transactional
    public ResponseEntity<?> update(UpdateOrderRequest orderDTO) {
        try {
            Order order = orderRepository.findById(orderDTO.getIdOrder())
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng"));

            List<OrderDetail> orderDetails = orderDetailRepository.findOrderDetailsByOrder(order);
            if ("Bị huỷ".equalsIgnoreCase(orderDTO.getStatus())
                    && !"Bị huỷ".equalsIgnoreCase(order.getStatus())) {
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
            Order savedOrder = orderRepository.save(order);
            return ResponseEntity.ok(ApiResponse.success("Đơn hàng đã được cập nhật thành công", mapToOrderResponse(savedOrder, orderDetails)));
        } catch (BadRequestException | NotFoundException e) {
            throw e;
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Cập nhật đơn hàng thất bại do dữ liệu xung đột");
        } catch (Exception e) {
            throw new InternalServerException("Cập nhật đơn hàng thất bại", e);
        }
    }

    private OrderResponse mapToOrderResponse(Order order, List<OrderDetail> orderDetails) {
        List<OrderDetailResponse> detailResponses = new ArrayList<>();
        if (orderDetails != null) {
            for (OrderDetail detail : orderDetails) {
                detailResponses.add(new OrderDetailResponse(
                        detail.getQuantity(),
                        detail.getPrice(),
                        detail.isReview(),
                        detail.getBook(),
                        detail.getOrder()
                ));
            }
        }

        String couponCode = order.getCoupon() != null ? order.getCoupon().getCode() : null;
        Integer couponDiscountPercent = order.getCoupon() != null ? order.getCoupon().getDiscountPercent() : null;

        return new OrderResponse(
                order.getIdOrder(),
                order.getDateCreated(),
                order.getDeliveryAddress(),
                order.getPhoneNumber(),
                order.getFullName(),
                order.getTotalPriceProduct(),
                order.getFeeDelivery(),
                order.getFeePayment(),
                order.getTotalPrice(),
                order.getStatus(),
                order.getNote(),
                order.getUser() != null ? order.getUser().getIdUser() : 0,
                order.getPayment() != null ? order.getPayment().getIdPayment() : 0,
                order.getDelivery() != null ? order.getDelivery().getIdDelivery() : 0,
                couponCode,
                couponDiscountPercent,
                order.getPaymentStatus(),
                detailResponses,
                null
        );
    }
}
