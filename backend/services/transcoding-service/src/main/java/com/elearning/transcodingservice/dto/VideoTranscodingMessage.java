package com.elearning.transcodingservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Minimal DTO matching media-service contract for transcoding requests
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class VideoTranscodingMessage {

    /**
     * Video ID for updating status in course service
     */
    private Long videoId;

    /**
     * Lesson ID that the video belongs to
     */
    private Long lessonId;

    /**
     * Public or presigned URL to download the source video
     */
    private String videoUrl;

}