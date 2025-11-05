package com.elearning.apigateway.service;

import org.springframework.data.domain.Pageable;
import com.elearning.apigateway.dto.request.NotificationRequest;
import com.elearning.apigateway.dto.response.NotificationResponse;
import com.elearning.apigateway.bff.response.MarkAllAsReadBFFResponse;
import com.elearning.apigateway.bff.response.MarkAsReadBFFResponse;
import com.elearning.apigateway.bff.response.ViewNotificationBFFResponse;

public interface NotificationService {

    NotificationResponse createNotification(NotificationRequest request);

    ViewNotificationBFFResponse getUserNotifications(String userId, Pageable pageable);

    MarkAllAsReadBFFResponse markAllAsRead(String userId);

    MarkAsReadBFFResponse markAsRead(String notificationId, String userId);

}
