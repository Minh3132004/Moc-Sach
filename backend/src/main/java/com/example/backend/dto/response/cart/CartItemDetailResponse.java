package com.example.backend.dto.response.cart;

import com.example.backend.dto.response.book.BookResponse;
import com.example.backend.dto.response.image.ImageResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDetailResponse {
    private Integer idCart;
    private Integer quantity;
    private Integer idUser;
    private BookResponse book;
    private List<ImageResponse> images;
}
