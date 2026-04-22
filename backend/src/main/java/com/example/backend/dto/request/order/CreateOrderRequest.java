package com.example.backend.dto.request.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private String deliveryAddress;

    private String phoneNumber;

    private String fullName;

    private double totalPriceProduct;

    private double totalPrice;

    private String note;

    @Positive(message = "idUser phải lớn hơn 0")
    private int idUser;

    @Positive(message = "idPayment phải lớn hơn 0")
    @NotNull(message = "idPayment không được để trống")
    private int idPayment;

    @Positive(message = "idDelivery phải lớn hơn 0")
    @NotNull(message = "idDelivery không được để trống")
    private int idDelivery;

    private String couponCode;
    private String paymentStatus;

    @Valid
    private List<OrderItemRequest> orderItems;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequest {
        @Positive(message = "idBook phải lớn hơn 0")
        private int idBook;

        @Positive(message = "Số lượng phải lớn hơn 0")
        private int quantity;
    }
}