package com.elearning.chatservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * File upload configuration
 */
@Configuration
public class FileUploadConfig {

    @Value("${file.upload.directory}")
    private String uploadDirectory;

    @PostConstruct
    public void init() throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
    }

    public String getUploadDirectory() {
        return uploadDirectory;
    }
}
