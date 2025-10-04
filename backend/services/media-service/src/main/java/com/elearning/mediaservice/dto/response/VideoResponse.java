package com.elearning.mediaservice.dto.response;

import com.elearning.mediaservice.enums.VideoStatus;
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
    private String fileName;
    private Long fileSize;
    private Integer durationSeconds;
    private String videoUrl;
    private String thumbnailUrl;
    private VideoStatus status;
    private String processingMessage;
    private Boolean isPreview;
    private LocalDateTime createdAt;
    
    // Upload info (chỉ khi đang upload)
    private String uploadId;
    private Integer totalChunks;
    private Integer uploadProgressPercent;
}
