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
    private Long userId; 
    private String type; 
    private String title;
    private String message;
    private boolean isRead; 
    private LocalDateTime createdAt;
    private Map<String, Object> metadata;
}
