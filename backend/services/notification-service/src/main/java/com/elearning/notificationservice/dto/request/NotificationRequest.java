package com.elearning.notificationservice.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import java.util.UUID;

@Data
public class NotificationRequest {

    @NotNull(message = "UserId cannot be null")
    private UUID userId;

    @NotBlank(message = "Notification type is required")
    private String type; // ORDER_SUCCESS, COURSE_UPDATE

    @NotBlank(message = "Title cannot be blank")
    private String title;

    @NotBlank(message = "Message cannot be blank")
    private String message;

    private Map<String, Object> metadata;
}
