package com.elearning.notificationservice.dto.event;

import lombok.*;

import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEvent {
    private UUID userId;
    private String type;
    private String title;
    private String message;
    private String actionUrl;
    private Map<String, Object> metadata;
}