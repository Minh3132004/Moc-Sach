package com.example.backend.dto.request.payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 255, message = "Tên sản phẩm tối đa 255 ký tự")
    private String productName;

    @NotBlank(message = "Mô tả không được để trống")
    @Size(max = 255, message = "Mô tả tối đa 255 ký tự")
    private String description;

    @NotBlank(message = "returnUrl không được để trống")
    private String returnUrl;

    @NotBlank(message = "cancelUrl không được để trống")
    private String cancelUrl;

    @NotNull(message = "Số tiền không được để trống")
    @Positive(message = "Số tiền phải lớn hơn 0")
    private Integer amount;
}