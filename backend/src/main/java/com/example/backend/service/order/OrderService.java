package com.example.backend.service.order;

import com.example.backend.dto.response.order.OrderResponse;
import org.springframework.http.ResponseEntity;

public interface OrderService {
    public ResponseEntity<?> save(OrderResponse orderDTO);
    public ResponseEntity<?> update(OrderResponse orderDTO);

}
