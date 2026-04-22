package com.example.backend.service.cart;

import com.example.backend.dto.request.cart.CartItemRequest;
import org.springframework.http.ResponseEntity;

public interface CartService {
    // Thêm sản phẩm vào giỏ hàng
    public ResponseEntity<?> save(CartItemRequest cartItemDTO);

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    public ResponseEntity<?> updateQuantity(int idCart, CartItemRequest cartItemDTO);
}
