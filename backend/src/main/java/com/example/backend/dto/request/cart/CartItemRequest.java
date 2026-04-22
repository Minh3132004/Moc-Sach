package com.example.backend.dto.request.cart;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CartItemRequest {

    @NotNull(message = "idBook không được để trống")
    @Positive(message = "idBook phải lớn hơn 0")
    private Integer idBook;

    @NotNull(message = "Số lượng không được để trống")
    @Positive(message = "Số lượng phải lớn hơn 0")
    private Integer quantity;

    @NotNull(message = "idUser không được để trống")
    @Positive(message = "idUser phải lớn hơn 0")
    private Integer idUser;
}