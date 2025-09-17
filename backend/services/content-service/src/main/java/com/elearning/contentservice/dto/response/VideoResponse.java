package com.elearning.contentservice.dto.response;

import com.elearning.contentservice.enums.VideoStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoResponse {
    
    private Long id;
    private Long lessonId;
    private String title;
    private String description;
    private String originalFileName;
    private Long fileSize;
    private Integer durationSeconds;
    private String videoUrl;
    private String thumbnailUrl;
    private VideoStatus status;
    private String processingMessage;
    private Boolean isPreview;
    private Boolean isActive;
    private Integer viewCount;
    private Long uploadedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Progress info (only for uploads in progress)
    private String uploadId;
    private Integer totalChunks;
    private Integer uploadedChunks;
    private Integer uploadProgressPercent;
}
