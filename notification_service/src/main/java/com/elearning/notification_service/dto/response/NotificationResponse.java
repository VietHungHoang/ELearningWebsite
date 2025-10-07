package com.elearning.notification_service.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class NotificationResponse {

    private String id; // Phải là String vì Notification.id là String
    private Long userId; // thêm userId cho FE nếu cần
    private String type;
    private String title;
    private String message;
    private boolean read; // đổi tên biến tránh conflict với Lombok getter
    private LocalDateTime createdAt;
    private Map<String, Object> metadata;
}
