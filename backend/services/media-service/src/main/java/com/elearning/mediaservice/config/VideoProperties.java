package com.elearning.mediaservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Configuration properties for video handling
 */
@Component
@ConfigurationProperties(prefix = "media.video")
@Data
public class VideoProperties {
    
    private long maxSizeInBytes = 2147483648L; // 2GB default
    
    private int chunkSizeInBytes = 5 * 1024 * 1024; // 5MB chunks for multipart upload
    
    private int presignedUrlExpiryMinutes = 15; // 15 minutes expiry for presigned URLs
    
    private List<String> allowedTypes = List.of(
            "video/mp4",
            "video/quicktime",
            "video/x-msvideo", // .avi
            "video/webm",
            "video/x-ms-wmv"   // .wmv
    );
    
    private List<String> allowedExtensions = List.of(
            ".mp4",
            ".mov",
            ".avi",
            ".webm",
            ".wmv"
    );
}