package com.example.backend.service.order;

import com.example.backend.dto.request.order.CreateOrderRequest;
import com.example.backend.dto.request.order.UpdateOrderRequest;
import org.springframework.http.ResponseEntity;

public interface OrderService {
    public ResponseEntity<?> save(CreateOrderRequest orderDTO);
    public ResponseEntity<?> update(UpdateOrderRequest orderDTO);
    public ResponseEntity<?> getTopBuyers(int size);

}
