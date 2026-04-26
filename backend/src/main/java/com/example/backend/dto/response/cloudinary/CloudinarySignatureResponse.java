package com.example.backend.dto.response.cloudinary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CloudinarySignatureResponse {
    private String signature;
    private Long timestamp;
    private String apiKey;
    private String cloudName;
    private String uploadPreset;
}
