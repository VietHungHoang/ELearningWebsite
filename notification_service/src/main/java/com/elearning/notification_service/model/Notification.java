package com.elearning.notification_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "notifications") // MongoDB collection
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    private String id;

    private Long userId; // người nhận thông báo
    private String type; // ví dụ: ORDER_SUCCESS, COURSE_UPDATE
    private String title;
    private String message;
    private boolean isRead; // đã đọc hay chưa
    private LocalDateTime createdAt;

    // Cho phép lưu thêm metadata tùy từng loại notification
    private Map<String, Object> metadata;
}
