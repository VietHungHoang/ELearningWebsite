package com.elearning.transcodingservice.event;

import com.elearning.transcodingservice.enums.VideoStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Event DTO for video processing completion
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class VideoProcessedEvent {

    /**
     * Video ID
     */
    private Long videoId;

    /**
     * Lesson ID that the video belongs to
     */
    private Long lessonId;

    /**
     * Processing status
     */
    private VideoStatus status;

    /**
     * Master playlist URL after transcoding
     */
    private String masterPlaylistUrl;

    /**
     * Error message if processing failed
     */
    private String errorMessage;

    /**
     * Timestamp when processing completed
     */
    private LocalDateTime processedAt;

}