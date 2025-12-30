package com.elearning.fileservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@ConfigurationProperties(prefix = "aws.s3")
@Data
public class StorageProperties {

    private String bucketName;
    private String region;
    private String baseUrl;
    private Map<String, String> folders;

    public String getBucketName() {
        return bucketName;
    }

    public String getRegion() {
        return region;
    }

    public String getBaseUrl() {
        if (baseUrl != null) {
            return baseUrl;
        }
        return String.format("https://%s.s3.%s.amazonaws.com/", bucketName, region);
    }

    public String getImagesFolder() {
        return folders != null ? folders.get("images") : "lernen/images";
    }

    public String getVideosFolder() {
        return folders != null ? folders.get("videos") : "lernen/videos";
    }

    public String getDocumentsFolder() {
        return folders != null ? folders.get("documents") : "lernen/documents";
    }

    /**
     * Get StorageInfo for API compatibility
     */
    public StorageInfo getStorageInfo() {
        return new StorageInfo(bucketName, region, getBaseUrl());
    }
}