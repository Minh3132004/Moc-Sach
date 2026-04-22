package com.example.backend.controller.cart;

import com.example.backend.dto.request.cart.CartItemRequest;
import com.example.backend.service.cart.CartService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart-item")
@Validated
public class CartItemController {

    @Autowired
    private CartService cartService;

    // Thêm sản phẩm vào giỏ hàng
    @PostMapping("/add-item")
    public ResponseEntity<?> add(@Valid @RequestBody CartItemRequest cartItemDTO) {
        return cartService.save(cartItemDTO);
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    @PutMapping("/update-quantity/{idCart}")
    public ResponseEntity<?> updateQuantity(@PathVariable @Positive(message = "idCart phải lớn hơn 0") int idCart,
            @Valid @RequestBody CartItemRequest cartItemDTO) {
        return cartService.updateQuantity(idCart, cartItemDTO);
    }
}
