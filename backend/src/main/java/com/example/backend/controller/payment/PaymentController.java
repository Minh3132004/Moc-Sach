package com.example.backend.controller.payment;

import com.example.backend.dto.request.payment.PaymentRequest;
import com.example.backend.dto.response.api.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.v2.paymentRequests.PaymentLinkItem;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PayOS payOS;

    // Tạo link thanh toán
    @PostMapping("/create-payment-link")
    public ApiResponse<CreatePaymentLinkResponse> createPaymentLink(
            @Valid @RequestBody PaymentRequest requestBody) {
        try {
            final String productName = requestBody.getProductName();
            final String description = requestBody.getDescription();
            final String returnUrl = requestBody.getReturnUrl();
            final String cancelUrl = requestBody.getCancelUrl();
            final long amount = requestBody.getAmount();

            long orderCode = System.currentTimeMillis() / 1000;

            PaymentLinkItem item = PaymentLinkItem.builder()
                    .name(productName)
                    .quantity(1)
                    .price(amount)
                    .build();

            CreatePaymentLinkRequest paymentData = CreatePaymentLinkRequest.builder()
                    .orderCode(orderCode)
                    .description(description)
                    .amount(amount)
                    .item(item)
                    .returnUrl(returnUrl)
                    .cancelUrl(cancelUrl)
                    .build();

            CreatePaymentLinkResponse data = payOS.paymentRequests().create(paymentData);
            return ApiResponse.success(data);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Không thể kết nối cổng thanh toán, vui lòng thử lại sau");
        }
    }

}