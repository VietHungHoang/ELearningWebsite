package com.elearning.apigateway.dto.request;

import java.util.Map;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating notification
 * Được gửi từ client hoặc từ các service khác
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    @NotNull(message = "UserId cannot be null")
    private Long userId;

    @NotBlank(message = "Notification type is required")
    private String type; // ORDER_SUCCESS, COURSE_UPDATE, ENROLLMENT_CONFIRMED, etc.

    @NotBlank(message = "Title cannot be blank")
    private String title;

    @NotBlank(message = "Message cannot be blank")
    private String message;

    private Map<String, Object> metadata; // Additional data như orderId, courseId, etc.
}
