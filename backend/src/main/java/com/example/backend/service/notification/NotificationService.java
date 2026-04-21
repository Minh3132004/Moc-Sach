package com.example.backend.service.notification;

import com.example.backend.dto.request.notification.NotificationRequest;
import org.springframework.http.ResponseEntity;

public interface NotificationService {
    ResponseEntity<?> create(NotificationRequest request);

    ResponseEntity<?> getByUser(int idUser);

    ResponseEntity<?> markAsRead(int idNotification, int idUser);

    ResponseEntity<?> markAllAsRead(int idUser);
}
