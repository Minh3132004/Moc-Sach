package com.example.backend.service.notification;

import com.example.backend.dao.notification.NotificationRepository;
import com.example.backend.dao.user.UserRepository;
import com.example.backend.dto.request.notification.NotificationRequest;
import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.dto.response.notification.NotificationResponse;
import com.example.backend.entity.notification.Notification;
import com.example.backend.entity.user.User;
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

    @Override
    public ResponseEntity<?> create(NotificationRequest request) {
        try {
            User user = userRepository.findById(request.getIdUser()).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Người dùng không tồn tại"));
            }
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Nội dung thông báo không được để trống"));
            }
            if (request.getType() == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Loại thông báo không hợp lệ"));
            }

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
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error("Tạo thông báo thất bại"));
        }
    }

    @Override
    public ResponseEntity<?> getByUser(int idUser) {
        try {
            List<NotificationResponse> responses = notificationRepository
                    .findByUser_IdUserOrderByCreatedAtDesc(idUser)
                    .stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thông báo thành công", responses));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error("Lấy danh sách thông báo thất bại"));
        }
    }

    @Override
    public ResponseEntity<?> markAsRead(int idNotification, int idUser) {
        try {
            Notification notification = notificationRepository.findById(idNotification).orElse(null);
            if (notification == null || notification.getUser() == null || notification.getUser().getIdUser() != idUser) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông báo"));
            }

            notification.setRead(true);
            notificationRepository.save(notification);
            return ResponseEntity.ok(ApiResponse.success("Đánh dấu đã đọc thành công", toResponse(notification)));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error("Cập nhật trạng thái thông báo thất bại"));
        }
    }

    @Override
    public ResponseEntity<?> markAllAsRead(int idUser) {
        try {
            List<Notification> notifications = notificationRepository.findByUser_IdUserOrderByCreatedAtDesc(idUser);
            notifications.forEach(n -> n.setRead(true));
            notificationRepository.saveAll(notifications);
            return ResponseEntity.ok(ApiResponse.success("Đánh dấu tất cả thông báo đã đọc thành công", null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error("Đánh dấu tất cả thông báo đã đọc thất bại"));
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
