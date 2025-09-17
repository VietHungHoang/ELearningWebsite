package com.elearning.contentservice.service.impl;

import com.elearning.contentservice.config.ImageProperties;
import com.elearning.contentservice.config.S3Properties;
import com.elearning.contentservice.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {
    
    private final S3Properties s3Properties;
    private final ImageProperties imageProperties;
    
    private S3Presigner getS3Presigner() {
        // Using default credential provider (IAM roles, environment variables, etc.)
        return S3Presigner.builder()
                .region(Region.of(s3Properties.getRegion()))
                .build();
    }
    
    @Override
    public List<String> generatePresignedUrls(String uploadId, int totalChunks) {
        log.info("Generating {} presigned URLs for upload ID: {}", totalChunks, uploadId);
        
        List<String> urls = new ArrayList<>();
        for (int i = 0; i < totalChunks; i++) {
            // Mock presigned URL - replace with actual S3 implementation
            String url = "https://mock-s3-bucket.amazonaws.com/" + uploadId + "/chunk-" + i + "?signature=mock-signature";
            urls.add(url);
        }
        
        return urls;
    }
    
    @Override
    public String completeMultipartUpload(String uploadId, List<String> etags) {
        log.info("Completing multipart upload for ID: {} with {} parts", uploadId, etags.size());
        
        // Mock video URL - replace with actual S3 implementation
        return "https://mock-s3-bucket.amazonaws.com/videos/" + uploadId + ".mp4";
    }
    
    @Override
    public void processVideo(String videoUrl, String uploadId) {
        log.info("Processing video at URL: {} for upload ID: {}", videoUrl, uploadId);
        
        // Mock processing - replace with actual FFmpeg implementation
        try {
            Thread.sleep(1000); // Simulate processing time
            log.info("Video processing completed for upload ID: {}", uploadId);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Video processing interrupted", e);
        }
    }
    
    @Override
    public String getThumbnailUrl(String uploadId) {
        // Mock thumbnail URL - replace with actual S3 implementation
        return "https://mock-s3-bucket.amazonaws.com/thumbnails/" + uploadId + ".jpg";
    }
    
    @Override
    public Integer getVideoDuration(String videoUrl) {
        log.info("Extracting duration for video: {}", videoUrl);
        
        // Mock duration - replace with actual FFmpeg implementation
        return 300; // 5 minutes
    }
    
    @Override
    public String generateImagePresignedUrl(String imageKey, String contentType) {
        log.info("Generating presigned URL for image: {} with content type: {}", imageKey, contentType);
        
        // Validate content type
        if (!imageProperties.getAllowedTypes().contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Unsupported image type: " + contentType);
        }
        
        try (S3Presigner presigner = getS3Presigner()) {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3Properties.getBucketName())
                    .key(imageKey)
                    .contentType(contentType)
                    .build();
            
            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(5)) // 5 minutes- expiry
                    .putObjectRequest(putObjectRequest)
                    .build();
            
            PresignedPutObjectRequest presignedRequest = presigner.presignPutObject(presignRequest);
            String presignedUrl = presignedRequest.url().toString();
            
            log.info("Generated presigned URL: {}", presignedUrl);
            return presignedUrl;
            
        } catch (Exception e) {
            log.error("Failed to generate presigned URL for image: {}", imageKey, e);
            throw new RuntimeException("Failed to generate presigned URL", e);
        }
    }
    
    @Override
    public String uploadImage(byte[] imageData, String imageKey, String contentType) {
        log.info("Uploading image with key: {} and size: {} bytes", imageKey, imageData.length);
        
        // Validate image data
        long maxSize = imageProperties.getMaxSizeInBytes();
        if (imageData.length > maxSize) {
            throw new IllegalArgumentException("Image size exceeds maximum allowed size of " + maxSize + " bytes");
        }
        
        if (!imageProperties.getAllowedTypes().contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Unsupported image type: " + contentType);
        }
        
        try {
            // Mock upload process - replace with actual S3 SDK implementation
            Thread.sleep(500); // Simulate upload time
            
            String imageUrl = String.format("%simages/%s", s3Properties.getBaseUrl(), imageKey);
            log.info("Image uploaded successfully: {}", imageUrl);
            
            return imageUrl;
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Image upload interrupted", e);
        }
    }
    
    @Override
    public void deleteImage(String imageKey) {
        log.info("Deleting image with key: {}", imageKey);
        
        try {
            // Mock deletion process - replace with actual S3 SDK implementation
            Thread.sleep(200); // Simulate deletion time
            log.info("Image deleted successfully: {}", imageKey);
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Image deletion interrupted", e);
        }
    }
    
    @Override
    public boolean isValidImageFile(String fileName, long fileSize) {
        log.debug("Validating image file: {} with size: {} bytes", fileName, fileSize);
        
        // Check file size
        long maxSize = imageProperties.getMaxSizeInBytes();
        if (fileSize > maxSize) {
            log.warn("Image file size {} exceeds maximum allowed size {}", fileSize, maxSize);
            return false;
        }
        
        // Check file extension
        String lowerFileName = fileName.toLowerCase();
        boolean hasValidExtension = imageProperties.getAllowedExtensions().stream()
                .anyMatch(lowerFileName::endsWith);
        
        if (!hasValidExtension) {
            log.warn("Image file {} has invalid extension. Allowed: {}", fileName, imageProperties.getAllowedExtensions());
            return false;
        }
        
        log.debug("Image file {} is valid", fileName);
        return true;
    }
}
