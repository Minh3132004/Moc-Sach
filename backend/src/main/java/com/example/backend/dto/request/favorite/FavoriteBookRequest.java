package com.example.backend.dto.request.favorite;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteBookRequest {

    @NotNull(message = "idUser không được để trống")
    @Positive(message = "idUser phải lớn hơn 0")
    private Integer idUser;

    @NotNull(message = "idBook không được để trống")
    @Positive(message = "idBook phải lớn hơn 0")
    private Integer idBook;
}