package com.example.backend.dto.response.notification;

import com.example.backend.entity.notification.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private int idNotification;
    private String title;
    private String message;
    private NotificationType type;
    private Integer referenceId;
    private String redirectUrl;
    private boolean isRead;
    private Timestamp createdAt;
}
