package com.example.backend.dto.request.notification;

import com.example.backend.entity.notification.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    private int idUser;
    private String title;
    private String message;
    private NotificationType type;
    private Integer referenceId;
    private String redirectUrl;
}
