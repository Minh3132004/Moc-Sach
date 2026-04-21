package com.example.backend.controller.notification;

import com.example.backend.dto.request.notification.NotificationRequest;
import com.example.backend.service.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody NotificationRequest request) {
        return notificationService.create(request);
    }

    @GetMapping("/user/{idUser}")
    public ResponseEntity<?> getByUser(@PathVariable int idUser) {
        return notificationService.getByUser(idUser);
    }

    @PutMapping("/read/{idNotification}")
    public ResponseEntity<?> markAsRead(@PathVariable int idNotification, @RequestParam int idUser) {
        return notificationService.markAsRead(idNotification, idUser);
    }

    @PutMapping("/read-all/{idUser}")
    public ResponseEntity<?> markAllAsRead(@PathVariable int idUser) {
        return notificationService.markAllAsRead(idUser);
    }
}
