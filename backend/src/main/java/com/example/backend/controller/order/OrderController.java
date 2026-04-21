package com.example.backend.controller.order;

import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.dto.response.order.OrderResponse;
import com.example.backend.service.order.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order")
public class OrderController {
    @Autowired
    private OrderService orderService;

    // Thêm đơn hàng
    @PostMapping("/add-order")
    public ResponseEntity<?> save(@RequestBody OrderResponse orderDTO) {
        try {
            return orderService.save(orderDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Tạo đơn hàng thất bại"));
        }
    }

    // Hủy đơn hàng 
    @PutMapping("/update-order")
    public ResponseEntity<?> update(@RequestBody OrderResponse orderDTO) {
        try {
            return orderService.update(orderDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Cập nhật đơn hàng thất bại"));
        }
    }
}
