package com.example.backend.dto.response.cart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {

    private Integer idBook;

    private Integer quantity;

    private Integer idUser;
}
