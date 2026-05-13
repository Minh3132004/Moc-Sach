package com.example.backend.service.cart;

import com.example.backend.dto.request.cart.CartItemRequest;
import org.springframework.http.ResponseEntity;

public interface CartService {
    // Thêm sản phẩm vào giỏ hàng
    public ResponseEntity<?> save(CartItemRequest cartItemDTO);

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    public ResponseEntity<?> updateQuantity(int idCart, CartItemRequest cartItemDTO);

    // Lấy danh sách sản phẩm trong giỏ hàng theo id người dùng
    public ResponseEntity<?> getCartItemsByUserId(int idUser);

    // Xóa sản phẩm khỏi giỏ hàng
    public ResponseEntity<?> delete(int idCart);
}
