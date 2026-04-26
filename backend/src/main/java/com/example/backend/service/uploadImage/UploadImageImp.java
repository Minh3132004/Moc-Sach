package com.example.backend.service.uploadImage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.backend.dto.response.cloudinary.CloudinarySignatureResponse;
import com.example.backend.exception.InternalServerException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UploadImageImp implements UploadImageService {

    private final Cloudinary cloudinary;

    // Xóa ảnh khỏi Cloudinary
    @Override
    public void deleteImage(String imageUrl) {
        try {
            String publicId = getPublicIdImg(imageUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
        } catch (IOException e) {
            throw new InternalServerException("Xóa ảnh thất bại", e);
        }
    }

    // Tạo signature cho Cloudinary
    @Override
    public CloudinarySignatureResponse generateSignature(String folder) {
        long timestamp = System.currentTimeMillis() / 1000;
        String uploadPreset = "mocsach"; // Tên preset đã tạo

        Map<String, Object> params = new HashMap<>();
        params.put("timestamp", timestamp);
        params.put("upload_preset", uploadPreset);
        if (folder != null && !folder.isEmpty()) {
            params.put("folder", folder);
        }

        String signature = cloudinary.apiSignRequest(params, cloudinary.config.apiSecret);

        return CloudinarySignatureResponse.builder()
                .signature(signature)
                .timestamp(timestamp)
                .apiKey(cloudinary.config.apiKey)
                .cloudName(cloudinary.config.cloudName)
                .uploadPreset(uploadPreset)
                .build();
    }

    // Lấy public_id từ URL
    private String getPublicIdImg(String imageUrl) {
        String[] parts = imageUrl.split("/");
        String publicIdWithFormat = parts[parts.length - 1]; // Chỉ lấy phần cuối cùng của URL

        // Tách public_id và định dạng
        String[] publicIdAndFormat = publicIdWithFormat.split("\\.");
        return publicIdAndFormat[0]; // Lấy public_id
    }
}
