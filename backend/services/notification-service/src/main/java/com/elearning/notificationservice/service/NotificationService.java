package com.elearning.notificationservice.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;

import com.elearning.notificationservice.dto.request.NotificationRequest;
import com.elearning.notificationservice.dto.response.NotificationResponse;

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

    /**
     * Send OTP email to user
     */
    void sendOtpEmail(String email, String otp);
}
