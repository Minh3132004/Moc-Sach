package com.example.backend.dto.response.review;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserReviewResponse {
    private int idUser;
    private String firstName;
    private String lastName;
    private String avatar;
}
