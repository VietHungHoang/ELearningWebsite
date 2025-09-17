package com.elearning.contentservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "aws.s3")
@Data
public class S3Properties {
    private String bucketName;
    private String region;

    public String getBaseUrl() {
        return String.format(
            "https://%s.s3.%s.amazonaws.com/",
            bucketName,
            region
        );
    }
}