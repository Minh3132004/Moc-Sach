package com.example.backend.controller.notification;

import com.example.backend.dto.request.notification.NotificationRequest;
import com.example.backend.service.notification.NotificationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notification")
@Validated
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@Valid @RequestBody NotificationRequest request) {
        return notificationService.create(request);
    }

    @GetMapping("/user/{idUser}")
    public ResponseEntity<?> getByUser(@PathVariable @Positive(message = "idUser phải lớn hơn 0") int idUser) {
        return notificationService.getByUser(idUser);
    }

    @PutMapping("/read/{idNotification}")
    public ResponseEntity<?> markAsRead(@PathVariable @Positive(message = "idNotification phải lớn hơn 0") int idNotification,
            @RequestParam @Positive(message = "idUser phải lớn hơn 0") int idUser) {
        return notificationService.markAsRead(idNotification, idUser);
    }

    @PutMapping("/read-all/{idUser}")
    public ResponseEntity<?> markAllAsRead(@PathVariable @Positive(message = "idUser phải lớn hơn 0") int idUser) {
        return notificationService.markAllAsRead(idUser);
    }
}
