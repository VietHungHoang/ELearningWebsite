package com.elearning.contentservice.service;

import org.springframework.web.multipart.MultipartFile;

public interface ImageService {
    
    /**
     * Generate unique image key with prefix
     * @param prefix the prefix for the image key (e.g., "course", "lesson", "user")
     * @param contentType the content type to determine file extension
     * @return generated image key like "course/uuid.jpg" or "lesson/uuid.png"
     */
    String generateImageKey(String prefix, String contentType);
    
    /**
     * Validate image file
     * @param file the multipart file to validate
     * @return true if valid, false otherwise
     */
    boolean isValidImage(MultipartFile file);
    
    /**
     * Get file extension from content type
     * @param contentType the content type (e.g., "image/jpeg")
     * @return file extension (e.g., "jpg")
     */
    String getFileExtension(String contentType);
}