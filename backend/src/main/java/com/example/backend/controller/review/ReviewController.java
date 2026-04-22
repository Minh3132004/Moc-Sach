package com.example.backend.controller.review;

import com.example.backend.dto.response.book.BookToReviewResponse;
import com.example.backend.service.review.ReviewService;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
@Validated
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // API: Lấy danh sách chờ đánh giá
    // [SỬA LỖI] Đổi ResponseEntityList thành ResponseEntity<List<...>>
    @GetMapping("/books-to-review/{userId}")
    public ResponseEntity<List<BookToReviewResponse>> getBooksToReview(
            @PathVariable @Positive(message = "userId phải lớn hơn 0") int userId) {
        return ResponseEntity.ok(reviewService.getBooksToReview(userId));
    }

    // API: Gửi đánh giá mới
    @PostMapping("/submit-new")
    public ResponseEntity<?> submitReview(@RequestBody JsonNode jsonNode) {
        return reviewService.submitReview(jsonNode);
    }
}

