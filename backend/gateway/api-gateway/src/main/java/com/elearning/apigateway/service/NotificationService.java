package com.elearning.apigateway.service;

import java.util.List;
import org.springframework.data.domain.Pageable;
import com.elearning.apigateway.dto.request.NotificationRequest;
import com.elearning.apigateway.dto.response.NotificationResponse;


public interface NotificationService {

    NotificationResponse createNotification(NotificationRequest request);

    List<NotificationResponse> getUserNotifications(Long userId, Pageable pageable);

    long getUnreadCount(Long userId);

    long markAllAsRead(Long userId);

    NotificationResponse markAsRead(String notificationId, Long userId);

}
