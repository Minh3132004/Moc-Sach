package com.example.backend.dto.response.book;

import com.example.backend.dto.response.genre.GenreResponse;
import com.example.backend.dto.response.image.ImageResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookResponse {
    private int idBook;
    private String nameBook;
    private String author;
    private String description;
    private double listPrice;
    private double sellPrice;
    private int quantity;
    private double avgRating;
    private int soldQuantity;
    private int discountPercent;
    
    private List<GenreResponse> genres;
    private List<ImageResponse> images;
}
