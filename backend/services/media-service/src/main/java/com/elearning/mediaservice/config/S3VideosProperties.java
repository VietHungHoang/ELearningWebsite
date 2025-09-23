package com.elearning.mediaservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "aws.s3.videos")
@Data
public class S3VideosProperties {
    private String bucketName;
    private String region;
}
