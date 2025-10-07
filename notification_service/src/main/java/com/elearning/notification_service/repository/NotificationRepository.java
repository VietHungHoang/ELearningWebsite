package com.elearning.notification_service.repository;

import com.elearning.notification_service.model.Notification;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    // Lấy danh sách thông báo theo user, sắp xếp mới nhất trước
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    // Dùng cho pagination
    List<Notification> findByUserId(Long userId, Pageable pageable);

    // Đếm số thông báo chưa đọc
    long countByUserIdAndIsReadFalse(Long userId);
}
