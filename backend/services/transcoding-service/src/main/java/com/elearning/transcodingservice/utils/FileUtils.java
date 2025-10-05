package com.elearning.transcodingservice.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Utility class for file operations
 */
@Slf4j
public class FileUtils {
    
    /**
     * Get human readable file size
     */
    public static String getHumanReadableSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format("%.1f %sB", bytes / Math.pow(1024, exp), pre);
    }
    
    /**
     * Calculate directory size recursively
     */
    public static long getDirectorySize(Path directory) {
        AtomicLong size = new AtomicLong(0);
        
        try {
            Files.walkFileTree(directory, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
                    size.addAndGet(attrs.size());
                    return FileVisitResult.CONTINUE;
                }
                
                @Override
                public FileVisitResult visitFileFailed(Path file, IOException exc) {
                    log.warn("Failed to visit file: {}", file, exc);
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) {
            log.error("Error calculating directory size", e);
        }
        
        return size.get();
    }
    
    /**
     * Get file extension from filename
     */
    public static String getFileExtension(String filename) {
        if (!StringUtils.hasText(filename)) {
            return "";
        }
        
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            return "";
        }
        
        return filename.substring(lastDotIndex + 1).toLowerCase();
    }
    
    /**
     * Get filename without extension
     */
    public static String getFileNameWithoutExtension(String filename) {
        if (!StringUtils.hasText(filename)) {
            return "";
        }
        
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return filename;
        }
        
        return filename.substring(0, lastDotIndex);
    }
    
    /**
     * Check if file is a video file based on extension
     */
    public static boolean isVideoFile(String filename) {
        String extension = getFileExtension(filename);
        return extension.matches("(?i)(mp4|avi|mov|wmv|flv|webm|mkv|m4v)");
    }
    
    /**
     * Sanitize filename for safe file system usage
     */
    public static String sanitizeFilename(String filename) {
        if (!StringUtils.hasText(filename)) {
            return "unknown";
        }
        
        // Replace unsafe characters with underscores
        return filename.replaceAll("[^a-zA-Z0-9.-]", "_");
    }
}