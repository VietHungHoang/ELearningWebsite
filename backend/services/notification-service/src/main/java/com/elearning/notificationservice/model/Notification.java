package com.elearning.notificationservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "notifications") 
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    private UUID id;
    private UUID userId; 
    private String type; 
    private String title;
    private String message;
    private String actionUrl;
    private boolean isRead; 
    private LocalDateTime createdAt;
}
