package com.example.backend.dto.request.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangeAvatarRequest {
    private int idUser;
    private String avatar; // Base64 string của ảnh
}

