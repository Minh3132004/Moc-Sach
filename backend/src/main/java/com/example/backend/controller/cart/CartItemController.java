package com.example.backend.controller.cart;
import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.dto.response.cart.CartItemResponse;
import com.example.backend.service.cart.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart-item")
public class CartItemController {

    @Autowired
    private CartService cartService;

    // Thêm sản phẩm vào giỏ hàng
    @PostMapping("/add-item")
    public ResponseEntity<?> add(@RequestBody CartItemResponse cartItemDTO) {
        try{
            return cartService.save(cartItemDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error("Thêm sản phẩm vào giỏ hàng thất bại"));
        }
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    @PutMapping("/update-quantity/{idCart}")
    public ResponseEntity<?> updateQuantity(@PathVariable int idCart ,@RequestBody CartItemResponse cartItemDTO) {
        try {
            return cartService.updateQuantity(idCart, cartItemDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error("Cập nhật giỏ hàng thất bại"));
        }
    }
}
