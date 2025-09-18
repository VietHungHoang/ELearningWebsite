package com.elearning.contentservice.service.impl;

import com.elearning.contentservice.config.ImageProperties;
import com.elearning.contentservice.config.S3ImagesProperties;
import com.elearning.contentservice.config.S3VideosProperties;
import com.elearning.contentservice.dto.response.InitiateUploadResponse;
import com.elearning.contentservice.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateMultipartUploadRequest;
import software.amazon.awssdk.services.s3.model.CreateMultipartUploadResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.UploadPartRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedUploadPartRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.UploadPartPresignRequest;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {
    
    private final S3ImagesProperties s3ImagesProperties;
    private final S3VideosProperties s3VideosProperties;
    private final ImageProperties imageProperties;
    
    private S3Presigner getS3Presigner(Region region) {
        // Using default credential provider (IAM roles, environment variables, etc.)
        return S3Presigner.builder()
                .region(region)
                .build();
    }

    private S3Client getS3Client(Region region) {
        return S3Client.builder()
                .region(region)
                .build();
    }
    
    public String getUploadId(String key, String contentType, int totalChunks) {

        try (S3Client s3Client = getS3Client(Region.of(s3VideosProperties.getRegion()))) {
            CreateMultipartUploadRequest request = CreateMultipartUploadRequest.builder()
                .bucket(s3VideosProperties.getBucketName())
                .key(key)
                .contentType(contentType)
                .build();

        CreateMultipartUploadResponse response = s3Client.createMultipartUpload(request);
        return response.uploadId();

        } catch (Exception e) {
            log.error("Failed to generate presigned URL for video: {}", key, e);
            throw new RuntimeException("Failed to generate presigned URL", e);
        }
        
    }

@Override
public List<String> generatePresignedUrls(String key, String uploadId, int totalChunks) {
    log.info("Generating {} presigned URLs for upload ID: {}", totalChunks, uploadId);
    
    List<String> urls = new ArrayList<>();
    
    try (S3Presigner presigner = getS3Presigner(Region.of(s3VideosProperties.getRegion()))) {
        
        for (int partNumber = 1; partNumber <= totalChunks; partNumber++) {
            // Create upload part request
            UploadPartRequest uploadPartRequest = UploadPartRequest.builder()
                    .bucket(s3VideosProperties.getBucketName())
                    .key(key) // The key for the multipart upload
                    .uploadId(uploadId)
                    .partNumber(partNumber)
                    .build();
            
            // Create presign request
            UploadPartPresignRequest presignRequest = UploadPartPresignRequest.builder()
                    .signatureDuration(Duration.ofHours(1)) // 1 hour expiry
                    .uploadPartRequest(uploadPartRequest)
                    .build();
            
            // Generate presigned URL
            PresignedUploadPartRequest presignedRequest = presigner.presignUploadPart(presignRequest);
            String presignedUrl = presignedRequest.url().toString();
            
            urls.add(presignedUrl);
            log.debug("Generated presigned URL for part {}: {}", partNumber, presignedUrl);
        }
        
        log.info("Successfully generated {} presigned URLs for upload ID: {}", totalChunks, uploadId);
        return urls;
        
    } catch (Exception e) {
        log.error("Failed to generate presigned URLs for upload ID: {}", uploadId, e);
        throw new RuntimeException("Failed to generate presigned URLs", e);
    }
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
        
        try (S3Presigner presigner = getS3Presigner(Region.of(s3ImagesProperties.getRegion()))) {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3ImagesProperties.getBucketName())
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
            
            String imageUrl = String.format("%simages/%s", s3ImagesProperties.getBaseUrl(), imageKey);
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
