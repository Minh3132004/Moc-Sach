package com.example.backend.controller.review;

import com.example.backend.dto.request.review.SubmitReviewRequest;
import com.example.backend.service.review.ReviewService;
import jakarta.validation.constraints.Positive;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/review")
@Validated
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Lấy danh sách chờ đánh giá
    @GetMapping("/books-to-review/{userId}")
    public ResponseEntity<?> getBooksToReview(
            @PathVariable @Positive(message = "userId phải lớn hơn 0") int userId) {
        return reviewService.getBooksToReview(userId);
    }

    // Gửi đánh giá mới
    @PostMapping("/submit-new")
    public ResponseEntity<?> submitReview(@Valid @RequestBody SubmitReviewRequest request) {
        return reviewService.submitReview(request);
    }
}
