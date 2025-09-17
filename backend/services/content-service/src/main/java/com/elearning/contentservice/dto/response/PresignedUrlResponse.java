package com.elearning.contentservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresignedUrlResponse {
    
    private String imageKey;
    private String presignedUrl;
    private String contentType;
    private Long courseId;
    private LocalDateTime expiresAt;
    private String description;
}