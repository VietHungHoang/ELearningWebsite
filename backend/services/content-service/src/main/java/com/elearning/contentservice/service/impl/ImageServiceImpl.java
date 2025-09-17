package com.elearning.contentservice.service.impl;

import com.elearning.contentservice.config.ImageProperties;
import com.elearning.contentservice.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    
    private final ImageProperties imageProperties;
    
    @Override
    public String generateImageKey(String prefix, String contentType) {
        String extension = getFileExtension(contentType);
        String uniqueId = UUID.randomUUID().toString();
        String imageKey = String.format("%s/%s.%s", prefix, uniqueId, extension);
        
        log.debug("Generated image key: {} for prefix: {} and content type: {}", imageKey, prefix, contentType);
        return imageKey;
    }
    
    @Override
    public boolean isValidImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            log.warn("File is null or empty");
            return false;
        }
        
        // Check file size
        long fileSize = file.getSize();
        long maxSize = imageProperties.getMaxSizeInBytes();
        if (fileSize > maxSize) {
            log.warn("File size {} exceeds maximum allowed size {}", fileSize, maxSize);
            return false;
        }
        
        // Check content type
        String contentType = file.getContentType();
        if (contentType == null || !imageProperties.getAllowedTypes().contains(contentType.toLowerCase())) {
            log.warn("Invalid content type: {}. Allowed types: {}", contentType, imageProperties.getAllowedTypes());
            return false;
        }
        
        // Check file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            log.warn("Original filename is null");
            return false;
        }
        
        String lowerFileName = originalFilename.toLowerCase();
        boolean hasValidExtension = imageProperties.getAllowedExtensions().stream()
                .anyMatch(lowerFileName::endsWith);
        
        if (!hasValidExtension) {
            log.warn("File {} has invalid extension. Allowed: {}", originalFilename, imageProperties.getAllowedExtensions());
            return false;
        }
        
        log.debug("File {} is valid", originalFilename);
        return true;
    }
    
    @Override
    public String getFileExtension(String contentType) {
        if (contentType == null) {
            throw new IllegalArgumentException("Content type cannot be null");
        }
        
        switch (contentType.toLowerCase()) {
            case "image/jpeg":
            case "image/jpg":
                return "jpg";
            case "image/png":
                return "png";
            case "image/webp":
                return "webp";
            case "image/gif":
                return "gif";
            default:
                throw new IllegalArgumentException("Unsupported content type: " + contentType);
        }
    }
}