package com.elearning.chatservice.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileStorageService {

    /**
     * Store a file and return its URL
     */
    String storeFile(MultipartFile file, String conversationId) throws IOException;

    /**
     * Store multiple files and return their URLs
     */
    List<String> storeFiles(List<MultipartFile> files, String conversationId) throws IOException;

    /**
     * Delete a file
     */
    void deleteFile(String fileUrl);

    /**
     * Get file content type
     */
    String getFileContentType(String fileName);

    /**
     * Generate thumbnail for image/video
     */
    String generateThumbnail(String fileUrl) throws IOException;
}
