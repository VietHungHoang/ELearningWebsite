package com.elearning.notification_service.service;

import com.elearning.notification_service.dto.request.NotificationRequest;
import com.elearning.notification_service.dto.response.NotificationResponse;

import java.util.List;

import org.springframework.data.domain.Pageable;

public interface NotificationService {

    /**
     * Tạo thông báo mới và push qua WebSocket tới user
     */
    NotificationResponse createNotification(NotificationRequest request);

    /**
     * Lấy toàn bộ thông báo của user
     */
    List<NotificationResponse> getUserNotifications(Long userId, Pageable pageable);

    /**
     * Đếm số thông báo chưa đọc
     */
    long getUnreadCount(Long userId);

    /**
     * Đánh dấu toàn bộ thông báo là đã đọc
     */
    long markAllAsRead(Long userId);

    /**
     * Đánh dấu 1 notification là đã đọc và push update qua WebSocket
     */
    NotificationResponse markAsRead(String notificationId, Long userId);
}
