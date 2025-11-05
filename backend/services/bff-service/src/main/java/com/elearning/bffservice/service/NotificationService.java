package com.elearning.bffservice.service;

import org.springframework.data.domain.Pageable;
import com.elearning.bffservice.dto.request.NotificationRequest;
import com.elearning.bffservice.dto.response.NotificationResponse;
import com.elearning.bffservice.bff.response.MarkAllAsReadBFFResponse;
import com.elearning.bffservice.bff.response.MarkAsReadBFFResponse;
import com.elearning.bffservice.bff.response.ViewNotificationBFFResponse;

public interface NotificationService {

    NotificationResponse createNotification(NotificationRequest request);

    ViewNotificationBFFResponse getUserNotifications(String userId, Pageable pageable);

    MarkAllAsReadBFFResponse markAllAsRead(String userId);

    MarkAsReadBFFResponse markAsRead(String notificationId, String userId);

}
