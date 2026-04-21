package com.example.backend.service.review;

import com.example.backend.dto.response.book.BookToReviewResponse;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ReviewService {
    // Lấy danh sách sách cần đánh giá
    List<BookToReviewResponse> getBooksToReview(int userId);

    // Gửi đánh giá
    ResponseEntity<?> submitReview(JsonNode jsonNode);
}
