package com.example.backend.dto.response.review;

import com.example.backend.dto.response.review.UserReviewResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {
    private long idReview;
    private String content;
    private float ratingPoint;
    private Timestamp timestamp;
    private UserReviewResponse user;
}
