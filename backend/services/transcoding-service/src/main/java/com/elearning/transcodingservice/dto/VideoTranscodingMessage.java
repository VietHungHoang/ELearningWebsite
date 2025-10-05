package com.elearning.transcodingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * DTO representing a video transcoding message from SQS
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class VideoTranscodingMessage {
    
    /**
     * S3 bucket name containing the raw video file
     */
    private String bucket;
    
    /**
     * S3 key (path) to the raw video file
     */
    private String key;
    
    /**
     * Video ID for updating status in course service
     */
    private String videoId;
    
    /**
     * Course ID that the video belongs to
     */
    private String lessonId;
    
    /**
     * Original filename
     */
    private String originalFilename;
    
    /**
     * File size in bytes
     */
    private Long fileSize;
    
    /**
     * Content type of the video file
     */
    private String contentType;
    
    /**
     * Timestamp when the video was uploaded
     */
    private Long uploadTimestamp;
}