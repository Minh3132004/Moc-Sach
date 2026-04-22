package com.example.backend.service.cart;

import com.example.backend.dao.book.BookRepository;
import com.example.backend.dao.cart.CartItemRepository;
import com.example.backend.dao.user.UserRepository;
import com.example.backend.dto.request.cart.CartItemRequest;
import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.entity.book.Book;
import com.example.backend.entity.cart.CartItem;
import com.example.backend.entity.user.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.InternalServerException;
import com.example.backend.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartServiceImp implements CartService {
    @Autowired
    public UserRepository userRepository;
    @Autowired
    public CartItemRepository cartItemRepository;
    @Autowired
    public BookRepository bookRepository;
    

    // Thêm sản phẩm vào giỏ hàng
    @Override
    public ResponseEntity<?> save(CartItemRequest cartItemDTO) {
        if (cartItemDTO == null) {
            throw new BadRequestException("Dữ liệu giỏ hàng không hợp lệ");
        }

        Optional<User> user = userRepository.findById(cartItemDTO.getIdUser());
        Optional<Book> book = bookRepository.findById(cartItemDTO.getIdBook());
        if (user.isEmpty()) {
            throw new NotFoundException("Không tìm thấy người dùng");
        }
        if (book.isEmpty()) {
            throw new NotFoundException("Không tìm thấy sách");
        }

        CartItem cartItem = new CartItem();
        cartItem.setUser(user.get());
        cartItem.setBook(book.get());
        cartItem.setQuantity(cartItemDTO.getQuantity());
        try {
            cartItemRepository.save(cartItem);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Thêm sản phẩm vào giỏ hàng thất bại do dữ liệu xung đột");
        } catch (Exception e) {
            throw new InternalServerException("Thêm sản phẩm vào giỏ hàng thất bại", e);
        }
        return ResponseEntity.ok(ApiResponse.success("Đã thêm sản phẩm vào giỏ hàng", null));
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    @Override
    public ResponseEntity<?> updateQuantity(int idCart, CartItemRequest cartItemDTO) {
        if (cartItemDTO == null) {
            throw new BadRequestException("Dữ liệu cập nhật giỏ hàng không hợp lệ");
        }
        if (idCart <= 0) {
            throw new BadRequestException("idCart phải lớn hơn 0");
        }

        Optional<CartItem> cartItem = cartItemRepository.findById(idCart);
        if (cartItem.isPresent()) {
            cartItem.get().setQuantity(cartItemDTO.getQuantity());
            try {
                cartItemRepository.save(cartItem.get());
            } catch (DataIntegrityViolationException e) {
                throw new ConflictException("Cập nhật giỏ hàng thất bại do dữ liệu xung đột");
            } catch (Exception e) {
                throw new InternalServerException("Cập nhật giỏ hàng thất bại", e);
            }
            return ResponseEntity.ok(ApiResponse.success("Đã cập nhật số lượng sản phẩm trong giỏ hàng", null));
        }
        throw new NotFoundException("Không tìm thấy sản phẩm trong giỏ hàng");
    }
}
