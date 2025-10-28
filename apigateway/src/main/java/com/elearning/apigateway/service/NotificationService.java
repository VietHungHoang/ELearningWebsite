package com.elearning.apigateway.service;

import java.util.List;
import org.springframework.data.domain.Pageable;
import com.elearning.apigateway.dto.request.NotificationRequest;
import com.elearning.apigateway.dto.response.NotificationResponse;

/**
 * Service interface for notification operations
 */
public interface NotificationService {

    /**
     * Tạo notification mới (có gửi WebSocket)
     */
    NotificationResponse createNotification(NotificationRequest request);

    /**
     * Lấy danh sách notification của user theo phân trang
     */
    List<NotificationResponse> getUserNotifications(Long userId, Pageable pageable);

    /**
     * Lấy số lượng notification chưa đọc
     */
    long getUnreadCount(Long userId);

    /**
     * Đánh dấu tất cả notification là đã đọc
     */
    long markAllAsRead(Long userId);

    /**
     * Đánh dấu 1 notification là đã đọc
     */
    NotificationResponse markAsRead(String notificationId, Long userId);

}
