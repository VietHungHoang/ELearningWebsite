package com.elearning.notification_service.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
public class NotificationResponse {

    private UUID id; 
    private UUID userId; 
    private String type;
    private String title;
    private String message;
    private boolean read; 
    private LocalDateTime createdAt;
    private Map<String, Object> metadata;
}
