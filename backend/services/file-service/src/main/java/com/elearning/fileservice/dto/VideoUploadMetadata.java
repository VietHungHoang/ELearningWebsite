package com.elearning.fileservice.dto;

import com.elearning.fileservice.enums.VideoStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Video Upload Metadata stored in Redis
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoUploadMetadata implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    private String uploadId;
    private String objectKey;
    private Long lessonId;
    private String fileName;
    private Long fileSize;
    private String title;
    private String description;
    private Boolean isPreview;
    private Long uploadedBy;
    private Integer totalChunks;
    private VideoStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime uploadCompletedAt;
}
