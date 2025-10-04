package com.elearning.mediaservice.service.impl;

import com.elearning.mediaservice.config.StorageInfo;
import com.elearning.mediaservice.config.StorageProperties;
import com.elearning.mediaservice.dto.response.PresignedUrlResponse;
import com.elearning.mediaservice.enums.MediaType;

import com.elearning.mediaservice.service.S3Service;
import com.elearning.mediaservice.strategy.MediaProcessingStrategy;
import com.elearning.mediaservice.strategy.MediaStrategyFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedUploadPartRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.UploadPartPresignRequest;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * S3 Service Implementation - main service that orchestrates S3 operations
 * Uses MediaProcessingStrategy to determine logic for different media types
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {
    
    private final MediaStrategyFactory mediaStrategyFactory;
    private final StorageProperties storageProperties;
    
    @Override
    public String generateObjectKey(String contentType) {
        log.info("Generating object key for content type: {}", contentType);
        
        MediaProcessingStrategy strategy = mediaStrategyFactory.getStrategyByContentType(contentType);
        String objectKey = strategy.generateObjectKey(contentType);
        
        log.debug("Generated object key: {} for media type: {}", objectKey, strategy.getMediaType());
        return objectKey;
    }

    @Override
    public String generateObjectUrl(StorageInfo storageInfo, String objectKey) {
        return storageInfo.getBaseUrl() + objectKey;
    }
    
    @Override
    public PresignedUrlResponse generatePresignedUrl(String contentType) {
        return null;
//        log.info("Generating presigned URL for content type: {}", contentType);
//
//        // Use strategy to get media-specific logic
//        MediaProcessingStrategy strategy = mediaStrategyFactory.getStrategyByContentType(contentType);
//        MediaType mediaType = strategy.getMediaType();
//
//        String objectKey = strategy.generateObjectKey(contentType);
//
//        String presignedUrl = generateS3PresignedUrl(objectKey, contentType, mediaType, strategy.getPresignedUrlExpiryMinutes());
//
//        String finalUrl = generateFinalUrl(objectKey, mediaType);
//
//        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(strategy.getPresignedUrlExpiryMinutes());
//
//        PresignedUrlResponse response = PresignedUrlResponse.builder()
//                .objectKey(objectKey)
//                .presignedUrl(presignedUrl)
//                .finalUrl(finalUrl)
//                .expiresAt(expiresAt)
//                .build();
//
//        log.info("Generated presigned URL successfully for {} with key: {}", mediaType, objectKey);
//        return response;
    }

    public String getUploadIDForMultipartUpload(StorageInfo storageInfo, String videoKey) {
        try (S3Client s3Client = S3Client.builder()
                .region(Region.of(storageInfo.getRegion()))
                .build()) {

            // Initiate multipart upload
            CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()
                    .bucket(storageInfo.getBucketName())
                    .key(videoKey)
                    .contentType("video/mp4")
                    .build();

            CreateMultipartUploadResponse createResponse = s3Client.createMultipartUpload(createRequest);
            String uploadId = createResponse.uploadId();

            log.info("AWS multipart upload created with ID: {}", uploadId);
            return uploadId;

        } catch (Exception e) {
            log.error("Failed to create multipart upload for video key: {}", videoKey, e);
            throw new RuntimeException("Failed to create multipart upload", e);
        }
    }

    
    @Override
    public String getPresignedUrlForUploadPart(S3Presigner presigner, UploadPartRequest uploadPartRequest) {
        log.info("Generating presigned URL for upload part - Bucket: {}, Key: {}, UploadId: {}, PartNumber: {}", 
                 uploadPartRequest.bucket(), uploadPartRequest.key(), 
                 uploadPartRequest.uploadId(), uploadPartRequest.partNumber());
        
        try {
            // Create presign request for upload part
            UploadPartPresignRequest presignRequest = UploadPartPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(15))
                    .uploadPartRequest(uploadPartRequest)
                    .build();
            
            // Generate presigned upload part request
            PresignedUploadPartRequest presignedRequest = presigner.presignUploadPart(presignRequest);
            
            String presignedUrl = presignedRequest.url().toString();
            log.info("Successfully generated presigned URL for upload part {}", uploadPartRequest.partNumber());
            
            return presignedUrl;
            
        } catch (Exception e) {
            log.error("Failed to generate presigned URL for upload part - Bucket: {}, Key: {}, UploadId: {}, PartNumber: {}", 
                     uploadPartRequest.bucket(), uploadPartRequest.key(), 
                     uploadPartRequest.uploadId(), uploadPartRequest.partNumber(), e);
            throw new RuntimeException("Failed to generate presigned URL for upload part", e);
        }
    }
    
    @Override
    public List<String> getPresignedUrlsForMultipartUpload(StorageInfo storageInfo, String objectKey, String uploadId, int totalChunks) {
        log.info("Generating {} presigned URLs for multipart upload - Bucket: {}, Key: {}, UploadId: {}", 
                 totalChunks, storageInfo.getBucketName(), objectKey, uploadId);
        
        List<String> presignedUrls = new ArrayList<>();
        
        try (S3Presigner presigner = S3Presigner.builder()
                .region(Region.of(storageInfo.getRegion()))
                .build()) {
            // Generate presigned URL for each part
            for (int partNumber = 1; partNumber <= totalChunks; partNumber++) {
                UploadPartRequest uploadPartRequest = UploadPartRequest.builder()
                        .bucket(storageInfo.getBucketName())
                        .key(objectKey)
                        .uploadId(uploadId)
                        .partNumber(partNumber)
                        .build();
                
                String presignedUrl = getPresignedUrlForUploadPart(presigner, uploadPartRequest);
                presignedUrls.add(presignedUrl);
            }
            
            log.info("Successfully generated {} presigned URLs for multipart upload with uploadId: {}", totalChunks, uploadId);
            return presignedUrls;
            
        } catch (Exception e) {
            log.error("Failed to generate presigned URLs for multipart upload - Bucket: {}, Key: {}, UploadId: {}", 
                     storageInfo.getBucketName(), objectKey, uploadId, e);
            throw new RuntimeException("Failed to generate presigned URLs for multipart upload", e);
        }
    }

    public void completeMultipartUpload(StorageInfo storageInfo, String videoKey, String uploadId, List<String> etags) {
        try (S3Client s3Client = S3Client.builder()
                .region(Region.of(storageInfo.getRegion()))
                .build()) {

            // Build completed parts list
            List<CompletedPart> completedParts = new ArrayList<>();
            for (int i = 0; i < etags.size(); i++) {
                CompletedPart part = CompletedPart.builder()
                        .partNumber(i + 1)
                        .eTag(etags.get(i))
                        .build();
                completedParts.add(part);
            }

            CompleteMultipartUploadRequest completeRequest = CompleteMultipartUploadRequest.builder()
                    .bucket(storageInfo.getBucketName())
                    .key(videoKey)
                    .uploadId(uploadId)  // Use the actual AWS Upload ID
                    .multipartUpload(CompletedMultipartUpload.builder()
                            .parts(completedParts)
                            .build())
                    .build();

            s3Client.completeMultipartUpload(completeRequest);
            log.info("Multipart upload completed successfully for video key: {} with AWS Upload ID: {}", videoKey, uploadId);

        } catch (Exception e) {
            log.error("Failed to complete multipart upload for video key: {} with AWS Upload ID: {}", videoKey, uploadId, e);
            throw new RuntimeException("Failed to complete multipart upload", e);
        }
    }
    
    /**
     * Generate actual S3 presigned URL using AWS SDK
     */
//    private String generateS3PresignedUrl(String objectKey, String contentType, MediaType mediaType, long expiryMinutes) {
//        StorageProperties bucketConfig = getBucketConfig(mediaType);
//
//        try (S3Presigner presigner = S3Presigner.builder()
//                .region(Region.of(bucketConfig.getRegion()))
//                .build()) {
//
//            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
//                    .bucket(bucketConfig.getName())
//                    .key(objectKey)
//                    .contentType(contentType)
//                    .build();
//
//            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
//                    .signatureDuration(Duration.ofMinutes(expiryMinutes))
//                    .putObjectRequest(putObjectRequest)
//                    .build();
//
//            PresignedPutObjectRequest presignedRequest = presigner.presignPutObject(presignRequest);
//            return presignedRequest.url().toString();
//
//        } catch (Exception e) {
//            log.error("Failed to generate S3 presigned URL for {}: {}", mediaType, objectKey, e);
//            throw new RuntimeException("Failed to generate presigned URL for " + mediaType, e);
//        }
//    }
    
    /**
     * Generate final URL that client can use after successful upload
     */
//    private String generateFinalUrl(String objectKey, MediaType mediaType) {
//        StorageProperties.BucketConfig bucketConfig = getBucketConfig(mediaType);
//        return bucketConfig.getBaseUrl() + objectKey;
//    }
//
//    /**
//     * Get S3 bucket configuration for media type
//     */
//    private StorageProperties.BucketConfig getBucketConfig(MediaType mediaType) {
//        return storageProperties.getBucketConfig(mediaType);
//    }
}
