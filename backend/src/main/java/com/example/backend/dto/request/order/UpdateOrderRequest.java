package com.example.backend.dto.request.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderRequest {
    @Positive(message = "idOrder phải lớn hơn 0")
    private int idOrder;

    @NotBlank(message = "Trạng thái không được để trống")
    private String status;
}