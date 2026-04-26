package com.example.backend.service.uploadImage;

import com.example.backend.dto.response.cloudinary.CloudinarySignatureResponse;

public interface UploadImageService {
    void deleteImage(String imgUrl);
    CloudinarySignatureResponse generateSignature(String folder);
}

