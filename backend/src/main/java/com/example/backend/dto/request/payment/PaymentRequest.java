package com.example.backend.dto.request.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private String productName;
    private String description;
    private String returnUrl;
    private String cancelUrl;
    private int amount;
}