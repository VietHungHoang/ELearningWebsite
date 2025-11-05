package com.elearning.bffservice.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.elearning.bffservice.client.NotificationServiceClient;
import com.elearning.bffservice.dto.request.NotificationRequest;
import com.elearning.bffservice.dto.response.NotificationResponse;
import com.elearning.bffservice.service.NotificationService;
import com.elearning.bffservice.bff.response.MarkAllAsReadBFFResponse;
import com.elearning.bffservice.bff.response.MarkAsReadBFFResponse;
import com.elearning.bffservice.bff.response.ViewNotificationBFFResponse;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationServiceClient notificationServiceClient;

    @Override
    public NotificationResponse createNotification(NotificationRequest request) {
        return notificationServiceClient.createNotification(request);
    }

    @Override
    public ViewNotificationBFFResponse getUserNotifications(String userId, Pageable pageable) {
        List<NotificationResponse> notifications = notificationServiceClient.getUserNotifications(userId,
                pageable.getPageNumber(), pageable.getPageSize());
        long unreadCount = notificationServiceClient.getUnreadCount(userId);
        List<ViewNotificationBFFResponse.NotificationItemBFF> notificationItems = notifications.stream()
                .map(n -> ViewNotificationBFFResponse.NotificationItemBFF.builder()
                        .id(n.getId())
                        .type(n.getType())
                        .title(n.getTitle())
                        .message(n.getMessage())
                        .read(n.isRead())
                        .createdAt(n.getCreatedAt() != null ? n.getCreatedAt().toString() : null)
                        .metadata(n.getMetadata())
                        .build())
                .collect(Collectors.toList());

        return ViewNotificationBFFResponse.builder()
                .userId(userId)
                .notifications(notificationItems)
                .totalCount(notificationItems.size())
                .page(pageable.getPageNumber())
                .pageSize(pageable.getPageSize())
                .unreadCount(unreadCount)
                .build();
    }

    @Override
    public MarkAllAsReadBFFResponse markAllAsRead(String userId) {
        long updatedCount = notificationServiceClient.markAllAsRead(userId);
        return MarkAllAsReadBFFResponse.builder()
                .userId(userId)
                .updatedCount(updatedCount)
                .message("All notifications marked as read")
                .build();
    }

    @Override
    public MarkAsReadBFFResponse markAsRead(String notificationId, String userId) {
        NotificationResponse response = notificationServiceClient.markAsRead(notificationId, userId);
        return MarkAsReadBFFResponse.builder()
                .notificationId(notificationId)
                .userId(userId)
                .read(response != null ? response.isRead() : false)
                .message("Notification marked as read")
                .build();
    }

}
