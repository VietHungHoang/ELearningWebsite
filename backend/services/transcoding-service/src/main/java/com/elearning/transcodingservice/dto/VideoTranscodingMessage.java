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
     * S3 bucket name where the source video is stored
     */
    private String bucketName;

    /**
     * Object key (path) inside the bucket for the source video
     */
    private String objectName;

}