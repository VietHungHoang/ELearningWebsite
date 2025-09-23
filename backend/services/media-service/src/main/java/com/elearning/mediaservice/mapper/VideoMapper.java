package com.elearning.mediaservice.mapper;

import com.elearning.mediaservice.dto.response.VideoResponse;
import com.elearning.mediaservice.model.Video;

public class VideoMapper {

    /**
     * Convert Video entity to VideoResponse DTO
     */
    public static VideoResponse toResponse(Video video) {
        if (video == null) {
            return null;
        }

        VideoResponse response = VideoResponse.builder()
                .id(video.getId())
                .lessonId(video.getLessonId())
                .title(video.getTitle())
                .description(video.getDescription())
                .originalFileName(video.getOriginalFileName())
                .fileSize(video.getFileSize())
                .durationSeconds(video.getDurationSeconds())
                .videoUrl(video.getVideoUrl())
                .thumbnailUrl(video.getThumbnailUrl())
                .status(video.getStatus())
                .processingMessage(video.getProcessingMessage())
                .isPreview(video.getIsPreview())
                .isActive(video.getIsActive())
                .viewCount(video.getViewCount())
                .uploadedBy(video.getUploadedBy())
                .createdAt(video.getCreatedAt())
                .updatedAt(video.getUpdatedAt())
                .uploadId(video.getUploadId())
                .totalChunks(video.getTotalChunks())
                .uploadedChunks(video.getUploadedChunks())
                .build();

        // Calculate upload progress percentage
        if (video.getTotalChunks() != null && video.getTotalChunks() > 0) {
            int progress = (int) ((double) video.getUploadedChunks() / video.getTotalChunks() * 100);
            response.setUploadProgressPercent(progress);
        }

        return response;
    }
}
