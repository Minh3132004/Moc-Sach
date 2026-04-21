package com.example.backend.dto.response.book;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookToReviewResponse {
    private long idOrderDetail;
    private String bookName;
    private String author;
    private String bookImage;
    private int orderId;
    private String dateCreated;
}
