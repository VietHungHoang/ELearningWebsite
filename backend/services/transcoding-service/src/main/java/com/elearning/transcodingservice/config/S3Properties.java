package com.elearning.transcodingservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Data
@Component
@ConfigurationProperties(prefix = "aws.s3")
public class S3Properties {
    private Map<String, StorageInfo> buckets = new HashMap<>();

    public StorageInfo getVideosRawConfig() {
        return buckets.get("VIDEO-RAW");
    }

    public StorageInfo getVideosStreamConfig() {
        return buckets.get("VIDEO-STREAM");
    }

    @Data
    public static class StorageInfo {
        private String bucketName;
        private String region;
    }
}
