package com.elearning.mediaservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "app.image")
@Data
public class ImageProperties {
    
    private String maxSize = "5MB";
    private List<String> allowedTypes = List.of("image/jpeg", "image/jpg", "image/png", "image/webp");
    private List<String> allowedExtensions = List.of(".jpg", ".jpeg", ".png", ".webp");
    
    /**
     * Convert max size string to bytes
     */
    public long getMaxSizeInBytes() {
        String size = maxSize.toUpperCase();
        if (size.endsWith("MB")) {
            return Long.parseLong(size.replace("MB", "")) * 1024 * 1024;
        } else if (size.endsWith("KB")) {
            return Long.parseLong(size.replace("KB", "")) * 1024;
        } else if (size.endsWith("GB")) {
            return Long.parseLong(size.replace("GB", "")) * 1024 * 1024 * 1024;
        } else {
            // Assume bytes
            return Long.parseLong(size);
        }
    }
}
