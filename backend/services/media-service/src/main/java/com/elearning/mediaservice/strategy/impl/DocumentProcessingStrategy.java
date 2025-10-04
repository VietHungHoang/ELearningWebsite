package com.elearning.mediaservice.strategy.impl;

import com.elearning.mediaservice.enums.MediaType;
import com.elearning.mediaservice.strategy.MediaProcessingStrategy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Strategy implementation for processing document files
 * Contains logic specific to document processing without S3 dependencies
 */
@Component
@Slf4j
public class DocumentProcessingStrategy implements MediaProcessingStrategy {
    
    @Override
    public MediaType getMediaType() {
        return MediaType.DOCUMENT;
    }
    
    @Override
    public String generateObjectKey(String contentType) {
        String basePrefix = "documents";
        String extension = getFileExtension(contentType);
        String uniqueId = UUID.randomUUID().toString();
        return String.format("%s/%s.%s", basePrefix, uniqueId, extension);
    }
    
    @Override
    public String getFileExtension(String contentType) {
        if (contentType == null) {
            throw new IllegalArgumentException("Content type cannot be null");
        }
        
        switch (contentType.toLowerCase()) {
            case "application/pdf":
                return "pdf";
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return "docx";
            case "application/msword":
                return "doc";
            case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                return "pptx";
            case "application/vnd.ms-powerpoint":
                return "ppt";
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                return "xlsx";
            case "application/vnd.ms-excel":
                return "xls";
            case "text/plain":
                return "txt";
            default:
                throw new IllegalArgumentException("Unsupported content type: " + contentType);
        }
    }
    
    @Override
    public long getPresignedUrlExpiryMinutes() {
        return 15; // 15 minutes for documents
    }
}