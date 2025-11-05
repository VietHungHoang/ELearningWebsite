package com.elearning.apigateway.dto.response;

import java.time.LocalDateTime;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private String id; 
    private String userId; 
    private String type; 
    private String title; 
    private String message; 
    private boolean read; 
    private LocalDateTime createdAt; 
    private Map<String, Object> metadata; 
}
