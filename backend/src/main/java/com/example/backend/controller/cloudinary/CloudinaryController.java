package com.example.backend.controller.cloudinary;

import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.service.uploadImage.UploadImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cloudinary")
public class CloudinaryController {

    @Autowired
    private UploadImageService uploadImageService;

    @GetMapping("/signature")
    public ResponseEntity<?> getSignature(@RequestParam(required = false) String folder) {
        return ResponseEntity.ok(ApiResponse.success(
                "Lấy chữ ký thành công",
                uploadImageService.generateSignature(folder)
        ));
    }
}
