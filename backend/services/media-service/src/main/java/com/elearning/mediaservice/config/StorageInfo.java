package com.elearning.mediaservice.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StorageInfo {
    private String bucketName;
    private String region;
    private String baseUrl;

    public StorageInfo(String bucketName, String region) {
        this.bucketName = bucketName;
        this.region = region;
    }

    public String getBaseUrl() {
        if (baseUrl != null) {
            return baseUrl;
        }
        // Generate default base URL if not provided
        return String.format("https://%s.s3.%s.amazonaws.com/", bucketName, region);
    }
}
