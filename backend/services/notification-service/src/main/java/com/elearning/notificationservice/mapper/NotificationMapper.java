package com.elearning.notificationservice.mapper;

import org.springframework.stereotype.Component;

import com.elearning.notificationservice.dto.event.NotificationEvent;
import com.elearning.notificationservice.dto.response.NotificationResponse;
import com.elearning.notificationservice.model.Notification;

import java.time.LocalDateTime;

@Component
public class NotificationMapper {

    public Notification toEntity(NotificationEvent event) {
        return Notification.builder()
                .userId(event.getUserId())
                .type(event.getType())
                .title(event.getTitle())
                .message(event.getMessage())
                .actionUrl(event.getActionUrl())
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .actionUrl(n.getActionUrl())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}