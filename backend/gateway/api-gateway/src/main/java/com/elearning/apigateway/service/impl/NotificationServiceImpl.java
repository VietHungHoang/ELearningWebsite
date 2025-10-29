package com.elearning.apigateway.service.impl;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.elearning.apigateway.client.NotificationServiceClient;
import com.elearning.apigateway.dto.request.NotificationRequest;
import com.elearning.apigateway.dto.response.NotificationResponse;
import com.elearning.apigateway.service.NotificationService;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationServiceClient notificationServiceClient;

    @Override
    public NotificationResponse createNotification(NotificationRequest request) {
        log.info("Creating notification for user: {}, type: {}", request.getUserId(), request.getType());
        return notificationServiceClient.createNotification(request);
    }

    @Override
    public List<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        log.info("Getting notifications for user: {}, page: {}, size: {}",
                userId, pageable.getPageNumber(), pageable.getPageSize());
        return notificationServiceClient.getUserNotifications(userId, pageable.getPageNumber(), pageable.getPageSize());
    }

    @Override
    public long getUnreadCount(Long userId) {
        log.info("Getting unread count for user: {}", userId);
        return notificationServiceClient.getUnreadCount(userId);
    }

    @Override
    public long markAllAsRead(Long userId) {
        log.info("Marking all notifications as read for user: {}", userId);
        return notificationServiceClient.markAllAsRead(userId);
    }

    @Override
    public NotificationResponse markAsRead(String notificationId, Long userId) {
        log.info("Marking notification as read: {} for user: {}", notificationId, userId);
        return notificationServiceClient.markAsRead(notificationId, userId);
    }

}
