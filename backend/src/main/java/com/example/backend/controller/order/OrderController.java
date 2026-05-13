package com.example.backend.controller.order;

import com.example.backend.dto.request.order.CreateOrderRequest;
import com.example.backend.dto.request.order.UpdateOrderRequest;
import com.example.backend.service.order.OrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order")
@Validated
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

    // Lấy top người mua theo tổng giá trị đơn hàng
    @GetMapping("/top-buyers")
    public ResponseEntity<?> getTopBuyers(@RequestParam(defaultValue = "100") int size) {
        return orderService.getTopBuyers(size);
    }

    // Lấy danh sách sách theo id đơn hàng
    @GetMapping("/{idOrder}/books")
    public ResponseEntity<?> getBooksByOrderId(@PathVariable @Positive(message = "idOrder phải lớn hơn 0") int idOrder) {
        return orderService.getBooksByOrderId(idOrder);
    }
}
