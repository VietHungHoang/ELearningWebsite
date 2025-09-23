package com.elearning.mediaservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageUploadResponse {
    
    private String imageKey;
    private String imageUrl;
    private String presignedUrl;
    private String contentType;
    private Long courseId;
    private LocalDateTime uploadedAt;
    private Long fileSize;
    private String status; // PENDING, UPLOADED, FAILED
    private String description;
}
