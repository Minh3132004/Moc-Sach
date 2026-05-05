package com.example.backend.service.review;

import com.example.backend.dto.request.review.SubmitReviewRequest;
import org.springframework.http.ResponseEntity;

public interface ReviewService {
    // Lấy danh sách review theo sách
    ResponseEntity<?> getReviewsByBookId(int idBook);

    // Lấy tổng số review
    ResponseEntity<?> getTotalReviews();

    // Lấy danh sách sách cần đánh giá
    ResponseEntity<?> getBooksToReview(int userId);

    // Gửi đánh giá
    ResponseEntity<?> submitReview(SubmitReviewRequest request);
}
