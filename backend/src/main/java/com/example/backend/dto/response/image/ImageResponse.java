package com.example.backend.dto.response.image;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageResponse {
    private int idImage;
    private String nameImage;
    private boolean isThumbnail;
    private String urlImage;
}
