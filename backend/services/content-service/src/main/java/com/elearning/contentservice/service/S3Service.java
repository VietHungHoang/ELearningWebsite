package com.elearning.contentservice.service;

import java.util.List;

public interface S3Service {

    public String getUploadId(String fileName, String contentType, int totalChunks);

    /**
     * Generate presigned URLs for multipart upload chunks
     */
    List<String> generatePresignedUrls(String key, String uploadId, int totalChunks);
    
    /**
     * Complete multipart upload and return final video URL
     */
    String completeMultipartUpload(String uploadId, List<String> etags);
    
    /**
     * Process video (extract metadata, generate thumbnail)
     */
    void processVideo(String videoUrl, String uploadId);
    
    /**
     * Get thumbnail URL for processed video
     */
    String getThumbnailUrl(String uploadId);
    
    /**
     * Get video duration in seconds
     */
    Integer getVideoDuration(String videoUrl);
    
    /**
     * Generate presigned URL for image upload (thumbnails, course images)
     */
    String generateImagePresignedUrl(String imageKey, String contentType);
    
    /**
     * Upload image directly to S3 and return the public URL
     */
    String uploadImage(byte[] imageData, String imageKey, String contentType);
    
    /**
     * Delete image from S3
     */
    void deleteImage(String imageKey);
    
    /**
     * Validate image file type and size
     */
    boolean isValidImageFile(String fileName, long fileSize);
}
