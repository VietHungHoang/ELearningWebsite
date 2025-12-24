package com.elearning.fileservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Configuration properties for document handling
 */
@Component
@ConfigurationProperties(prefix = "media.document")
@Data
public class DocumentProperties {
    
    private long maxSizeInBytes = 50 * 1024 * 1024; // 50MB default
    
    private List<String> allowedTypes = List.of(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
            "application/msword", // .doc
            "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
            "application/vnd.ms-powerpoint", // .ppt
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/vnd.ms-excel", // .xls
            "text/plain" // .txt
    );
    
    private List<String> allowedExtensions = List.of(
            ".pdf",
            ".docx",
            ".doc",
            ".pptx",
            ".ppt",
            ".xlsx",
            ".xls",
            ".txt"
    );
}