package com.example.backend.dto.response.book;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
