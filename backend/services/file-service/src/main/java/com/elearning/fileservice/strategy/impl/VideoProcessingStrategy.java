package com.elearning.fileservice.strategy.impl;

import com.elearning.fileservice.config.StorageProperties;
import com.elearning.fileservice.enums.MediaType;
import com.elearning.fileservice.strategy.MediaProcessingStrategy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Strategy implementation for processing video files
 * Contains logic specific to video processing without S3 dependencies
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class VideoProcessingStrategy implements MediaProcessingStrategy {
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    private final StorageProperties storageProperties;
    
    @Override
    public MediaType getMediaType() {
        return MediaType.VIDEO;
    }
    
    @Override
    public String generateObjectKey(String contentType) {
        String folderPath = storageProperties.getVideosFolder();
        String dateFolder = LocalDate.now().format(DATE_FORMATTER);
        String extension = getFileExtension(contentType);
        String uniqueId = UUID.randomUUID().toString();
        return String.format("%s/%s/%s.%s", folderPath, dateFolder, uniqueId, extension);
    }
    
    @Override
    public String getFileExtension(String contentType) {
        if (contentType == null) {
            throw new IllegalArgumentException("Content type cannot be null");
        }
        
        switch (contentType.toLowerCase()) {
            case "video/mp4":
                return "mp4";
            case "video/quicktime":
                return "mov";
            case "video/x-msvideo":
                return "avi";
            case "video/webm":
                return "webm";
            case "video/x-ms-wmv":
                return "wmv";
            default:
                throw new IllegalArgumentException("Unsupported content type: " + contentType);
        }
    }
    
    @Override
    public long getPresignedUrlExpiryMinutes() {
        return 120; // 2 hours for videos
    }
}