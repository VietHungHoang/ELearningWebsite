package com.elearning.mediaservice.strategy.impl;

import com.elearning.mediaservice.enums.MediaType;
import com.elearning.mediaservice.strategy.MediaProcessingStrategy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Strategy implementation for processing image files
 * Contains logic specific to image processing without S3 dependencies
 */
@Component
@Slf4j
public class ImageProcessingStrategy implements MediaProcessingStrategy {
    
    @Override
    public MediaType getMediaType() {
        return MediaType.IMAGE;
    }
    
    @Override
    public String generateObjectKey(String contentType) {
        String basePrefix = "images";
        String extension = getFileExtension(contentType);
        String uniqueId = UUID.randomUUID().toString();
        return String.format("%s/%s.%s", basePrefix, uniqueId, extension);
    }
    
    @Override
    public String getFileExtension(String contentType) {
        if (contentType == null) {
            throw new IllegalArgumentException("Content type cannot be null");
        }
        
        switch (contentType.toLowerCase()) {
            case "image/jpeg":
            case "image/jpg":
                return "jpg";
            case "image/png":
                return "png";
            case "image/webp":
                return "webp";
            case "image/gif":
                return "gif";
            default:
                throw new IllegalArgumentException("Unsupported content type: " + contentType);
        }
    }
    
    @Override
    public long getPresignedUrlExpiryMinutes() {
        return 5; // 5 minutes for images
    }
}