package com.example.backend.dto.request.api;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiRequest<T> {

    @NotNull(message = "Dữ liệu gửi lên không được để trống")
    private T data;
}
