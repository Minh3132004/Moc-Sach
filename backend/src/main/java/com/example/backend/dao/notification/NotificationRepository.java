package com.example.backend.dao.notification;

import com.example.backend.entity.notification.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(path = "notifications")
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUser_IdUserOrderByCreatedAtDesc(int idUser);
}
