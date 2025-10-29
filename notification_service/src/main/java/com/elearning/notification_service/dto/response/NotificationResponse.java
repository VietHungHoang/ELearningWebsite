package com.elearning.notification_service.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class NotificationResponse {

    private String id; 
    private Long userId; 
    private String type;
    private String title;
    private String message;
    private boolean read; 
    private LocalDateTime createdAt;
    private Map<String, Object> metadata;
}
