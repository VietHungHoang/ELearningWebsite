package com.elearning.mediaservice.service;

public interface ImageService {
    
    /**
     * Get file extension from content type
     * @param contentType the content type (e.g., "image/jpeg")
     * @return file extension (e.g., "jpg")
     */
    String getFileExtension(String contentType);
}
