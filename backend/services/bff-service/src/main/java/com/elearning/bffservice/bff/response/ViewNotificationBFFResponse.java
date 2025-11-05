package com.elearning.bffservice.bff.response;

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
public class ViewNotificationBFFResponse {

    private String userId;

    private List<NotificationItemBFF> notifications;
    private Integer totalCount;
    private Integer page;
    private Integer pageSize;

    private Long unreadCount;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationItemBFF {
        private String id;
        private String type;
        private String title;
        private String message;
        private boolean read;
        private String createdAt;
        private Map<String, Object> metadata;
    }
}
