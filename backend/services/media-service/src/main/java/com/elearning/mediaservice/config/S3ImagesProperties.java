package com.elearning.mediaservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "aws.s3.images")
@Data
public class S3ImagesProperties {
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
