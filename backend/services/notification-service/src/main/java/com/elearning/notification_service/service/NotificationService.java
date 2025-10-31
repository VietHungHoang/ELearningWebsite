package com.elearning.notification_service.service;

import com.elearning.notification_service.dto.request.NotificationRequest;
import com.elearning.notification_service.dto.response.NotificationResponse;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;

public interface NotificationService {

    /**
     * Create a new notification and push it via WebSocket to the user
     */
    NotificationResponse createNotification(NotificationRequest request);

    /**
     * Get all notifications of the user
     */
    List<NotificationResponse> getUserNotifications(UUID userId, Pageable pageable);

    /**
     * Count the number of unread notifications
     */
    long getUnreadCount(UUID userId);

    /**
     * Mark all notifications as read
     */
    long markAllAsRead(UUID userId);

    /**
     * Mark one notification as read and push the update via WebSocket
     */
    NotificationResponse markAsRead(UUID notificationId, UUID userId);
}
