package com.example.backend.controller.order;

import com.example.backend.dto.request.order.CreateOrderRequest;
import com.example.backend.dto.request.order.UpdateOrderRequest;
import com.example.backend.service.order.OrderService;
import jakarta.validation.Valid;
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
    public ResponseEntity<?> save(@Valid @RequestBody CreateOrderRequest orderDTO) {
        return orderService.save(orderDTO);
    }

    // Hủy đơn hàng 
    @PutMapping("/update-order")
    public ResponseEntity<?> update(@Valid @RequestBody UpdateOrderRequest orderDTO) {
        return orderService.update(orderDTO);
    }
}
