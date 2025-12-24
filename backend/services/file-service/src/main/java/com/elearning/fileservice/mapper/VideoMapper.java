package com.elearning.fileservice.mapper;

import org.springframework.stereotype.Component;

import com.elearning.fileservice.dto.response.VideoResponse;
import com.elearning.fileservice.enums.VideoStatus;
import com.elearning.fileservice.model.Video;

@Component
public class VideoMapper {

    /**
     * Convert Video entity to VideoResponse DTO
     */
    public VideoResponse toResponse(Video video) {
        if (video == null) {
            return null;
        }

        VideoResponse response = VideoResponse.builder()
                .id(video.getId())
                .lessonId(video.getLessonId())
                .title(video.getTitle())
                .description(video.getDescription())
                .fileName(video.getOriginalFileName())
                .fileSize(video.getFileSize())
                .durationSeconds(video.getDurationSeconds())
                .videoUrl(video.getVideoUrl())
                .thumbnailUrl(video.getThumbnailUrl())
                .status(video.getStatus())
                .processingMessage(video.getProcessingMessage())
                .isPreview(video.getIsPreview())
                .createdAt(video.getCreatedAt())
                .uploadId(video.getUploadId())
                .totalChunks(video.getTotalChunks())
                .build();

        // Set upload progress based on status
        if (video.getStatus() == VideoStatus.UPLOADING) {
            response.setUploadProgressPercent(0);
        } else if (video.getStatus() == VideoStatus.PROCESSING || video.getStatus() == VideoStatus.READY) {
            response.setUploadProgressPercent(100);
        }

        return response;
    }
}
