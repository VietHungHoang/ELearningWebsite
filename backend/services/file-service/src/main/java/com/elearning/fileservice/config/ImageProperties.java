package com.elearning.fileservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Configuration properties for image handling
 */
@Component
@ConfigurationProperties(prefix = "media.image")
@Data
public class ImageProperties {
    
    private long maxSizeInBytes = 10 * 1024 * 1024; // 10MB default
    
    private List<String> allowedTypes = List.of(
            "image/jpeg",
            "image/jpg", 
            "image/png",
            "image/webp",
            "image/gif"
    );
    
    private List<String> allowedExtensions = List.of(
            ".jpg",
            ".jpeg",
            ".png", 
            ".webp",
            ".gif"
    );
}