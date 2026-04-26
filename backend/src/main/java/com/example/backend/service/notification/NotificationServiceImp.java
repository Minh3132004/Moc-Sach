package com.example.backend.service.notification;

import com.example.backend.dao.notification.NotificationRepository;
import com.example.backend.dao.user.UserRepository;
import com.example.backend.dto.request.notification.NotificationRequest;
import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.dto.response.notification.NotificationResponse;
import com.example.backend.entity.notification.Notification;
import com.example.backend.entity.user.User;
import com.example.backend.exception.InternalServerException;
import com.example.backend.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImp implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    //Tạo thông báo cho người dùng
    @Override
    public ResponseEntity<?> create(NotificationRequest request) {
        try {
            User user = userRepository.findById(request.getIdUser())
                    .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));

            Notification notification = Notification.builder()
                    .title(request.getTitle())
                    .message(request.getMessage())
                    .type(request.getType())
                    .referenceId(request.getReferenceId())
                    .redirectUrl(request.getRedirectUrl())
                    .isRead(false)
                    .user(user)
                    .build();

            Notification saved = notificationRepository.save(notification);
            return ResponseEntity.ok(ApiResponse.success("Tạo thông báo thành công", toResponse(saved)));
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Tạo thông báo thất bại", e);
        }
    }
    //Lấy danh sách thông báo người dùng theo idUser
    @Override
    public ResponseEntity<?> getByUser(int idUser) {
        try {
            userRepository.findById(idUser)
                    .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));

            List<NotificationResponse> responses = notificationRepository
                    .findByUser_IdUserOrderByCreatedAtDesc(idUser)
                    .stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thông báo thành công", responses));
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Lấy danh sách thông báo thất bại", e);
        }
    }

    // Đánh dấu đã đọc thông báo từ người dùng
    @Override
    public ResponseEntity<?> markAsRead(int idNotification, int idUser) {
        try {
            userRepository.findById(idUser)
                    .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));

            Notification notification = notificationRepository.findById(idNotification)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy thông báo"));

            if (notification.getUser() == null || notification.getUser().getIdUser() != idUser) {
                throw new NotFoundException("Không tìm thấy thông báo");
            }

            notification.setRead(true);
            Notification saved = notificationRepository.save(notification);
            return ResponseEntity.ok(ApiResponse.success("Đánh dấu đã đọc thành công", toResponse(saved)));
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Đánh dấu đã đọc thất bại", e);
        }
    }

    @Override
    public ResponseEntity<?> markAllAsRead(int idUser) {
        try {
            userRepository.findById(idUser)
                    .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));

            List<Notification> notifications = notificationRepository.findByUser_IdUserOrderByCreatedAtDesc(idUser);
            notifications.forEach(n -> n.setRead(true));
            List<Notification> saved = notificationRepository.saveAll(notifications);

            List<NotificationResponse> responses = saved.stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Đánh dấu tất cả thông báo đã đọc thành công", responses));
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Đánh dấu tất cả đã đọc thất bại", e);
        }
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getIdNotification(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.getReferenceId(),
                notification.getRedirectUrl(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
