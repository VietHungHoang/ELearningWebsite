package com.elearning.apigateway.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.elearning.apigateway.dto.request.NotificationRequest;
import com.elearning.apigateway.dto.response.NotificationResponse;
import com.elearning.apigateway.service.NotificationService;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    @Override
    public NotificationResponse createNotification(NotificationRequest request) {
        log.info("Creating notification for user: {}, type: {}", request.getUserId(), request.getType());

        // Build response
        NotificationResponse response = NotificationResponse.builder()
                .id(UUID.randomUUID().toString()) // Generate notification ID
                .userId(request.getUserId())
                .type(request.getType())
                .title(request.getTitle())
                .message(request.getMessage())
                .read(false)
                .createdAt(LocalDateTime.now())
                .metadata(request.getMetadata())
                .build();

        log.info("Notification created with ID: {}", response.getId());
        return response;
    }

    @Override
    public List<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        log.info("Getting notifications for user: {}, page: {}, size: {}",
                userId, pageable.getPageNumber(), pageable.getPageSize());
        return List.of();
    }

    @Override
    public long getUnreadCount(Long userId) {
        log.info("Getting unread count for user: {}", userId);
        return 0;
    }

    @Override
    public long markAllAsRead(Long userId) {
        log.info("Marking all notifications as read for user: {}", userId);

        return 0;
    }

    @Override
    public NotificationResponse markAsRead(String notificationId, Long userId) {
        log.info("Marking notification as read: {} for user: {}", notificationId, userId);
        return NotificationResponse.builder()
                .id(notificationId)
                .userId(userId)
                .read(true)
                .build();
    }

}
