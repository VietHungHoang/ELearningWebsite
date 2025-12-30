package com.elearning.fileservice.service.impl;

import com.elearning.fileservice.config.StorageProperties;
import com.elearning.fileservice.config.VideoProperties;
import com.elearning.fileservice.dto.VideoUploadMetadata;
import com.elearning.fileservice.dto.request.CompleteUploadRequest;
import com.elearning.fileservice.dto.request.InitiateUploadRequest;
import com.elearning.fileservice.dto.response.InitiateUploadResponse;
import com.elearning.fileservice.dto.response.VideoResponse;
import com.elearning.fileservice.enums.VideoStatus;
import com.elearning.fileservice.service.S3Service;
import com.elearning.fileservice.service.VideoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Video Service Implementation - handles video upload with presigned URLs and multipart upload
 * Uses Redis to store upload metadata
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class VideoServiceImpl implements VideoService {
    
    private final S3Service s3Service;
    private final StorageProperties storageProperties;
    private final VideoProperties videoProperties;
    private final RedisTemplate<String, Object> redisTemplate;
    
    private static final String UPLOAD_METADATA_PREFIX = "video:upload:";
    private static final Duration METADATA_TTL = Duration.ofHours(24); // 24 hours expiry
    
    @Override
    public InitiateUploadResponse initiateUpload(InitiateUploadRequest request, Long uploadedBy) {
        log.info("Initiating multipart upload for lesson {} by user {}", request.getLessonId(), uploadedBy);
        
        // Validate file size
        if (request.getFileSize() > videoProperties.getMaxSizeInBytes()) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of " + videoProperties.getMaxSizeInBytes() + " bytes");
        }
        
        // Generate unique object key for the video
        String objectKey = generateVideoObjectKey(request.getFileName());
        log.debug("Generated object key: {}", objectKey);
        
        // Calculate chunks
        int chunkSize = videoProperties.getChunkSizeInBytes();
        int totalChunks = (int) Math.ceil((double) request.getFileSize() / chunkSize);
        log.debug("File will be split into {} chunks of {} bytes", totalChunks, chunkSize);
        
        // Initiate multipart upload with AWS S3
        String uploadId = s3Service.getUploadIDForMultipartUpload(
                storageProperties.getStorageInfo(), 
                objectKey
        );
        log.info("AWS multipart upload initiated with uploadId: {}", uploadId);
        
        // Generate presigned URLs for all parts
        List<String> presignedUrls = s3Service.getPresignedUrlsForMultipartUpload(
                storageProperties.getStorageInfo(),
                objectKey,
                uploadId,
                totalChunks
        );
        log.debug("Generated {} presigned URLs for upload parts", presignedUrls.size());
        
        // Store upload metadata in Redis
        VideoUploadMetadata metadata = VideoUploadMetadata.builder()
                .uploadId(uploadId)
                .objectKey(objectKey)
                .lessonId(request.getLessonId())
                .fileName(request.getFileName())
                .fileSize(request.getFileSize())
                .title(request.getTitle())
                .description(request.getDescription())
                .isPreview(request.getIsPreview())
                .uploadedBy(uploadedBy)
                .totalChunks(totalChunks)
                .status(VideoStatus.UPLOADING)
                .createdAt(LocalDateTime.now())
                .build();
        
        String redisKey = UPLOAD_METADATA_PREFIX + uploadId;
        redisTemplate.opsForValue().set(redisKey, metadata, METADATA_TTL);
        log.info("Upload metadata stored in Redis with key: {}", redisKey);
        
        // Return response
        return InitiateUploadResponse.builder()
                .videoId(null) // Will be generated after complete
                .uploadId(uploadId)
                .presignedUrls(presignedUrls)
                .chunkSize(chunkSize)
                .totalChunks(totalChunks)
                .build();
    }
    
    @Override
    public VideoResponse completeUpload(CompleteUploadRequest request) {
        log.info("Completing multipart upload for uploadId: {}", request.getUploadId());
        
        // Retrieve metadata from Redis
        String redisKey = UPLOAD_METADATA_PREFIX + request.getUploadId();
        VideoUploadMetadata metadata = (VideoUploadMetadata) redisTemplate.opsForValue().get(redisKey);
        
        if (metadata == null) {
            log.error("Upload metadata not found in Redis for uploadId: {}", request.getUploadId());
            throw new IllegalArgumentException("Upload ID not found or expired");
        }
        
        // Validate ETags count
        if (request.getEtags().size() != metadata.getTotalChunks()) {
            log.error("ETags count mismatch. Expected: {}, Received: {}", 
                    metadata.getTotalChunks(), request.getEtags().size());
            throw new IllegalArgumentException("Invalid number of ETags");
        }
        
        // Complete multipart upload in S3
        try {
            s3Service.completeMultipartUpload(
                    storageProperties.getStorageInfo(),
                    metadata.getObjectKey(),
                    request.getUploadId(),
                    request.getEtags()
            );
            log.info("Multipart upload completed successfully for uploadId: {}", request.getUploadId());
            
            // Update metadata status
            metadata.setStatus(VideoStatus.PROCESSING);
            metadata.setUploadCompletedAt(LocalDateTime.now());
            
            // Update in Redis
            redisTemplate.opsForValue().set(redisKey, metadata, METADATA_TTL);
            
            // Generate video URL
            String videoUrl = s3Service.generateObjectUrl(
                    storageProperties.getStorageInfo(),
                    metadata.getObjectKey()
            );
            
            // Build response
            VideoResponse response = VideoResponse.builder()
                    .id(null) // In production, save to database and get ID
                    .lessonId(metadata.getLessonId())
                    .title(metadata.getTitle())
                    .description(metadata.getDescription())
                    .fileName(metadata.getFileName())
                    .fileSize(metadata.getFileSize())
                    .videoUrl(videoUrl)
                    .status(VideoStatus.PROCESSING)
                    .processingMessage("Video uploaded successfully. Processing will start soon.")
                    .isPreview(metadata.getIsPreview())
                    .createdAt(metadata.getCreatedAt())
                    .uploadId(request.getUploadId())
                    .totalChunks(metadata.getTotalChunks())
                    .uploadProgressPercent(100)
                    .build();
            
            log.info("Upload completed for lesson {} - {}", metadata.getLessonId(), metadata.getTitle());
            return response;
            
        } catch (Exception e) {
            log.error("Error completing multipart upload for uploadId: {}", request.getUploadId(), e);
            
            // Update status to FAILED
            metadata.setStatus(VideoStatus.FAILED);
            redisTemplate.opsForValue().set(redisKey, metadata, METADATA_TTL);
            
            throw new RuntimeException("Failed to complete upload: " + e.getMessage(), e);
        }
    }
    
    @Override
    public VideoResponse getUploadStatus(String uploadId) {
        log.debug("Getting upload status for uploadId: {}", uploadId);
        
        // Retrieve metadata from Redis
        String redisKey = UPLOAD_METADATA_PREFIX + uploadId;
        VideoUploadMetadata metadata = (VideoUploadMetadata) redisTemplate.opsForValue().get(redisKey);
        
        if (metadata == null) {
            log.error("Upload metadata not found in Redis for uploadId: {}", uploadId);
            throw new IllegalArgumentException("Upload ID not found or expired");
        }
        
        // Build response with current status
        VideoResponse.VideoResponseBuilder builder = VideoResponse.builder()
                .id(null)
                .lessonId(metadata.getLessonId())
                .title(metadata.getTitle())
                .description(metadata.getDescription())
                .fileName(metadata.getFileName())
                .fileSize(metadata.getFileSize())
                .status(metadata.getStatus())
                .isPreview(metadata.getIsPreview())
                .createdAt(metadata.getCreatedAt())
                .uploadId(uploadId)
                .totalChunks(metadata.getTotalChunks());
        
        // Add video URL if upload is completed
        if (metadata.getStatus() != VideoStatus.UPLOADING) {
            String videoUrl = s3Service.generateObjectUrl(
                    storageProperties.getStorageInfo(),
                    metadata.getObjectKey()
            );
            builder.videoUrl(videoUrl);
        }
        
        // Calculate progress
        int progressPercent = metadata.getStatus() == VideoStatus.UPLOADING ? 0 : 100;
        builder.uploadProgressPercent(progressPercent);
        
        return builder.build();
    }
    
    /**
     * Generate unique video object key for S3 storage
     */
    private String generateVideoObjectKey(String fileName) {
        String videosFolder = storageProperties.getVideosFolder();
        String timestamp = String.valueOf(System.currentTimeMillis());
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        
        // Extract file extension
        String extension = "";
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = fileName.substring(dotIndex);
        }
        
        return String.format("%s/%s_%s%s", videosFolder, timestamp, uuid, extension);
    }
}
