package com.elearning.fileservice.strategy;

import com.elearning.fileservice.enums.MediaType;

/**
 * Strategy interface for processing different types of media files
 * Defines the logic for each media type without S3 dependencies
 */
public interface MediaProcessingStrategy {
    
    /**
     * Get the media type this strategy handles
     * @return MediaType enum
     */
    MediaType getMediaType();
    
    /**
     * Generate a unique object key for the media file
     * @param contentType the content type of the file
     * @return unique object key for S3 storage
     */
    String generateObjectKey(String contentType);
    
    /**
     * Get file extension from content type
     * @param contentType the content type (e.g., "image/jpeg")
     * @return file extension (e.g., "jpg")
     */
    String getFileExtension(String contentType);
    
    /**
     * Get expiry duration in minutes for presigned URLs
     * @return expiry time in minutes
     */
    long getPresignedUrlExpiryMinutes();
}