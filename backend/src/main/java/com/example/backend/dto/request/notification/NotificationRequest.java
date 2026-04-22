package com.example.backend.dto.request.notification;

import com.example.backend.entity.notification.NotificationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    @NotNull(message = "idUser không được để trống")
    @Positive(message = "idUser phải lớn hơn 0")
    private Integer idUser;

    @NotBlank(message = "Tiêu đề thông báo không được để trống")
    @Size(max = 255, message = "Tiêu đề thông báo tối đa 255 ký tự")
    private String title;

    @NotBlank(message = "Nội dung thông báo không được để trống")
    @Size(max = 1000, message = "Nội dung thông báo tối đa 1000 ký tự")
    private String message;

    @NotNull(message = "Loại thông báo không được để trống")
    private NotificationType type;
    private Integer referenceId;

    @Size(max = 500, message = "Đường dẫn chuyển hướng tối đa 500 ký tự")
    private String redirectUrl;
}
