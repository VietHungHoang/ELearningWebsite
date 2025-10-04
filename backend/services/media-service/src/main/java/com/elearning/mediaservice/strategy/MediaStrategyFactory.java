package com.elearning.mediaservice.strategy;

import com.elearning.mediaservice.enums.MediaType;
import com.elearning.mediaservice.strategy.impl.DocumentProcessingStrategy;
import com.elearning.mediaservice.strategy.impl.ImageProcessingStrategy;
import com.elearning.mediaservice.strategy.impl.VideoProcessingStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.EnumMap;
import java.util.Map;

/**
 * Factory class for selecting the appropriate media processing strategy
 */
@Component
@RequiredArgsConstructor
public class MediaStrategyFactory {
    
    private final ImageProcessingStrategy imageProcessingStrategy;
    private final VideoProcessingStrategy videoProcessingStrategy;
    private final DocumentProcessingStrategy documentProcessingStrategy;
    
    private final Map<MediaType, MediaProcessingStrategy> strategies = new EnumMap<>(MediaType.class);
    
    @PostConstruct
    public void initialize() {
        strategies.put(MediaType.IMAGE, imageProcessingStrategy);
        strategies.put(MediaType.VIDEO, videoProcessingStrategy);
        strategies.put(MediaType.DOCUMENT, documentProcessingStrategy);
    }
    
    /**
     * Get the appropriate strategy for the given media type
     * @param mediaType the media type
     * @return the corresponding processing strategy
     * @throws IllegalArgumentException if media type is not supported
     */
    public MediaProcessingStrategy getStrategy(MediaType mediaType) {
        MediaProcessingStrategy strategy = strategies.get(mediaType);
        if (strategy == null) {
            throw new IllegalArgumentException("No strategy found for media type: " + mediaType);
        }
        return strategy;
    }
    
    /**
     * Detect media type from content type
     * @param contentType the content type string
     * @return the detected media type
     * @throws IllegalArgumentException if content type is not supported
     */
    public MediaType detectMediaType(String contentType) {
        if (contentType == null) {
            throw new IllegalArgumentException("Content type cannot be null");
        }
        
        String lowerContentType = contentType.toLowerCase();
        
        if (lowerContentType.startsWith("image/")) {
            return MediaType.IMAGE;
        } else if (lowerContentType.startsWith("video/")) {
            return MediaType.VIDEO;
        } else if (lowerContentType.startsWith("application/") || lowerContentType.startsWith("text/")) {
            // Check specific document types
            if (lowerContentType.equals("application/pdf") ||
                lowerContentType.contains("officedocument") ||
                lowerContentType.equals("application/msword") ||
                lowerContentType.equals("application/vnd.ms-powerpoint") ||
                lowerContentType.equals("application/vnd.ms-excel") ||
                lowerContentType.equals("text/plain")) {
                return MediaType.DOCUMENT;
            }
        }
        
        throw new IllegalArgumentException("Unsupported content type: " + contentType);
    }
    
    /**
     * Get strategy by content type detection
     * @param contentType the content type string
     * @return the corresponding processing strategy
     */
    public MediaProcessingStrategy getStrategyByContentType(String contentType) {
        MediaType mediaType = detectMediaType(contentType);
        return getStrategy(mediaType);
    }
}