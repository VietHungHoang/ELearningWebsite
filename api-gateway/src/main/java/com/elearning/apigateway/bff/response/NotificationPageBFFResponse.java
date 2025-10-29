package com.elearning.apigateway.bff.response;

import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPageBFFResponse {

    private Long userId;

    private List<NotificationDetailDTO> notifications;
    private Integer totalCount;
    private Integer page;
    private Integer pageSize;

    private Long unreadCount;
    private Long totalNotifications;

    private Map<String, List<NotificationDetailDTO>> notificationsByType;
    private Map<String, List<NotificationDetailDTO>> notificationsByDate;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationDetailDTO {
        private String notificationId;
        private String type; // ORDER_SUCCESS, COURSE_UPDATE, ENROLLMENT_CONFIRMED, etc.
        private String title;
        private String message;
        private Map<String, Object> metadata; // orderId, courseId, etc.
        private boolean read;
    }
}
