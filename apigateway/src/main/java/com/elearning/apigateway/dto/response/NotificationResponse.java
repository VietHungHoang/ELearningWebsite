package com.elearning.apigateway.dto.response;

import java.time.LocalDateTime;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for notification response
 * Trả về thông tin notification cho FE
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private String id; // Notification ID (String vì MongoDB có thể dùng)
    private Long userId; // User ID nhận notification
    private String type; // Type của notification
    private String title; // Tiêu đề
    private String message; // Nội dung
    private boolean read; // Đã đọc hay chưa
    private LocalDateTime createdAt; // Thời điểm tạo
    private Map<String, Object> metadata; // Additional data
}
