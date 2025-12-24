package com.elearning.fileservice.service.impl;

import com.elearning.fileservice.config.StorageProperties;
import com.elearning.fileservice.config.VideoProperties;
import com.elearning.fileservice.dto.request.CompleteUploadRequest;
import com.elearning.fileservice.dto.request.InitiateUploadRequest;
import com.elearning.fileservice.dto.response.InitiateUploadResponse;
import com.elearning.fileservice.dto.response.VideoResponse;
import com.elearning.fileservice.enums.VideoStatus;
import com.elearning.fileservice.events.VideoTranscodingMessage;
import com.elearning.fileservice.exception.VideoNotFoundException;
import com.elearning.fileservice.mapper.VideoMapper;
import com.elearning.fileservice.model.Video;
import com.elearning.fileservice.repository.VideoRepository;
import com.elearning.fileservice.service.KafkaProducerService;
import com.elearning.fileservice.service.S3Service;
import com.elearning.fileservice.service.VideoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Video Service Implementation with multipart upload support
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class VideoServiceImpl implements VideoService {
    
    private final VideoRepository videoRepository;
    private final VideoMapper videoMapper;
    private final VideoProperties videoProperties;
    private final StorageProperties storageProperties;
    private final S3Service s3Service;
    private final KafkaProducerService kafkaProducerService;


    @Override
    public InitiateUploadResponse initiateUpload(InitiateUploadRequest request, Long uploadedBy) {
        log.info("Initiating upload for lesson {} by user {}", request.getLessonId(), uploadedBy);
        
        // Validate file size
        if (request.getFileSize() > videoProperties.getMaxSizeInBytes()) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size");
        }
        
        // Calculate total chunks
        int chunkSize = videoProperties.getChunkSizeInBytes();
        int totalChunks = (int) Math.ceil((double) request.getFileSize() / chunkSize);
        
        // Generate video key first
        String tempId = UUID.randomUUID().toString();
        String videoKey = generateVideoKey(tempId, request.getFileName());
        
        try {
            // Generate presigned URLs for each chunk and get AWS upload ID
            String uploadId = s3Service.getUploadIDForMultipartUpload(storageProperties.getVideosRaw(), videoKey);
            
            // Generate actual presigned URLs for upload
            List<String> presignedUrls = s3Service.getPresignedUrlsForMultipartUpload(
                    storageProperties.getVideosRaw(),
                    videoKey,
                    uploadId,
                    totalChunks
            );
            
            Video video = Video.builder()
                    .lessonId(request.getLessonId())
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .originalFileName(request.getFileName())
                    .fileSize(request.getFileSize())
                    .uploadId(uploadId)  // Use AWS upload ID
                    .totalChunks(totalChunks)
                    .isPreview(request.getIsPreview())
                    .uploadedBy(uploadedBy)
                    .status(VideoStatus.UPLOADING)
                    .videoUrl(s3Service.generateObjectUrl(storageProperties.getVideosRaw(), videoKey))
                    .build();
            
            Video savedVideo = videoRepository.save(video);
            
            log.info("Upload initiated successfully. Video ID: {}, AWS Upload ID: {}, Total chunks: {}", 
                    savedVideo.getId(), uploadId, totalChunks);
            
            return InitiateUploadResponse.builder()
                    .videoId(savedVideo.getId())
                    .uploadId(uploadId)
                    .presignedUrls(presignedUrls)
                    .chunkSize(chunkSize)
                    .totalChunks(totalChunks)
                    .build();
                    
        } catch (Exception e) {
            log.error("Failed to initiate upload for lesson {}", request.getLessonId(), e);
            throw new RuntimeException("Failed to initiate upload", e);
        }
    }

    @Override
    public VideoResponse completeUpload(CompleteUploadRequest request) {
        log.info("Completing upload for upload ID: {}", request.getUploadId());
        
        Video video = videoRepository.findByUploadId(request.getUploadId())
                .orElseThrow(() -> new VideoNotFoundException("Video not found with upload ID: " + request.getUploadId()));
        
        // Validate ETags count matches total chunks
        if (request.getEtags().size() != video.getTotalChunks()) {
            throw new IllegalArgumentException("Number of ETags does not match total chunks");
        }
        
        String videoKey = extractVideoKeyFromUrl(video.getVideoUrl());
        
        try {
            // Complete multipart upload on S3 using the AWS Upload ID directly
            s3Service.completeMultipartUpload(
                    storageProperties.getVideosRaw(),
                    videoKey,
                    request.getUploadId(),
                    request.getEtags()
            );
            
            // Update video status and metadata
            video.setStatus(VideoStatus.PROCESSING);
            video.setProcessingStartedAt(LocalDateTime.now());
            
            Video updatedVideo = videoRepository.save(video);
            
            // Send transcoding message to Kafka
            sendTranscodingMessage(updatedVideo);
            
            log.info("Upload completed successfully for video ID: {}", updatedVideo.getId());
            
            return videoMapper.toResponse(updatedVideo);
            
        } catch (Exception e) {
            log.error("Failed to complete upload for upload ID: {}", request.getUploadId(), e);
            
            // Update video status to failed
            video.setStatus(VideoStatus.FAILED);
            video.setProcessingMessage("Failed to complete upload: " + e.getMessage());
            videoRepository.save(video);
            
            throw new RuntimeException("Failed to complete upload", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public VideoResponse getUploadStatus(String uploadId) {
        Video video = videoRepository.findByUploadId(uploadId)
                .orElseThrow(() -> new VideoNotFoundException("Video not found with upload ID: " + uploadId));
        
        return videoMapper.toResponse(video);
    }

    @Override
    @Transactional(readOnly = true)
    public VideoResponse getVideoById(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new VideoNotFoundException("Video not found with ID: " + id));
        
        return videoMapper.toResponse(video);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VideoResponse> getVideosByLessonId(Long lessonId) {
        List<Video> videos = videoRepository.findByLessonIdAndIsActiveTrue(lessonId);
        return videos.stream()
                .map(videoMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VideoResponse> getVideosByLessonIdPaginated(Long lessonId, Pageable pageable) {
        Page<Video> videos = videoRepository.findByLessonIdAndIsActiveTrue(lessonId, pageable);
        return videos.map(videoMapper::toResponse);
    }

    @Override
    public VideoResponse updateVideo(Long id, String title, String description, Boolean isPreview) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new VideoNotFoundException("Video not found with ID: " + id));
        
        if (title != null) video.setTitle(title);
        if (description != null) video.setDescription(description);
        if (isPreview != null) video.setIsPreview(isPreview);
        
        Video updatedVideo = videoRepository.save(video);
        return videoMapper.toResponse(updatedVideo);
    }

    @Override
    public void deleteVideo(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new VideoNotFoundException("Video not found with ID: " + id));
        
        video.setIsActive(false);
        videoRepository.save(video);
        
        log.info("Video {} soft deleted successfully", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VideoResponse> getVideosByStatus(String status, Pageable pageable) {
        VideoStatus videoStatus = VideoStatus.valueOf(status.toUpperCase());
        Page<Video> videos = videoRepository.findByStatusAndIsActiveTrue(videoStatus, pageable);
        return videos.map(videoMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VideoResponse> getVideosByUploaderId(Long uploaderId, Pageable pageable) {
        Page<Video> videos = videoRepository.findByUploadedByAndIsActiveTrue(uploaderId, pageable);
        return videos.map(videoMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VideoResponse> getPreviewVideos(Pageable pageable) {
        Page<Video> videos = videoRepository.findByIsPreviewTrueAndIsActiveTrue(pageable);
        return videos.map(videoMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countVideosByLessonId(Long lessonId) {
        return videoRepository.countByLessonIdAndIsActiveTrue(lessonId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countVideosByStatus(String status) {
        VideoStatus videoStatus = VideoStatus.valueOf(status.toUpperCase());
        return videoRepository.countByStatusAndIsActiveTrue(videoStatus);
    }

    @Override
    public void processVideo(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new VideoNotFoundException("Video not found with ID: " + id));
        
        if (video.getStatus() != VideoStatus.READY && video.getStatus() != VideoStatus.FAILED) {
            processVideoAsync(video);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VideoResponse> getPendingProcessingVideos(Pageable pageable) {
        Page<Video> videos = videoRepository.findByStatusAndIsActiveTrue(VideoStatus.PROCESSING, pageable);
        return videos.map(videoMapper::toResponse);
    }

    /**
     * Generate video key for S3 storage
     */
    private String generateVideoKey(String uuidName, String originalFileName) {
        String extension = originalFileName.substring(originalFileName.lastIndexOf('.'));
        return String.format("videos/%s%s", uuidName, extension);
    }



    /**
     * Extract video key from S3 URL
     */
    private String extractVideoKeyFromUrl(String videoUrl) {
        if (videoUrl == null) {
            throw new IllegalArgumentException("Video URL is null");
        }
        return videoUrl.replace(storageProperties.getVideosRaw().getBaseUrl(), "");
    }

    /**
     * Extract S3 object name (key) from the full URL previously stored in video.videoUrl
     */
    private String extractObjectNameFromUrl(String videoUrl) {
        if (videoUrl == null) {
            throw new IllegalArgumentException("Video URL is null");
        }
        String base = storageProperties.getVideosRaw().getBaseUrl();
        if (videoUrl.startsWith(base)) {
            return videoUrl.substring(base.length());
        }
        // Fallback: try to find the path after the bucket host
        int idx = videoUrl.indexOf(".amazonaws.com/");
        if (idx != -1) {
            return videoUrl.substring(idx + ".amazonaws.com/".length());
        }
        // As a last resort, return the original URL (not ideal but keeps behavior)
        return videoUrl;
    }

    /**
     * Send transcoding message to Kafka
     */
    private void sendTranscodingMessage(Video video) {
        try {
            // Build message with bucketName and objectName instead of a full URL
            String objectName = extractObjectNameFromUrl(video.getVideoUrl());
            String bucketName = storageProperties.getVideosRaw().getBucketName();

            VideoTranscodingMessage message = VideoTranscodingMessage.builder()
                    .videoId(video.getId())
                    .lessonId(video.getLessonId())
                    .bucketName(bucketName)
                    .objectName(objectName)
                    .build();

            kafkaProducerService.sendVideoTranscodingMessage(message);

            log.info("Sent transcoding message to Kafka for video ID: {}", video.getId());

        } catch (Exception e) {
            log.error("Failed to send transcoding message for video ID: {}", video.getId(), e);

            // Update video status to failed
            video.setStatus(VideoStatus.FAILED);
            video.setProcessingMessage("Failed to send transcoding message: " + e.getMessage());
            videoRepository.save(video);
        }
    }
    
    /**
     * Process video asynchronously (extract metadata, generate thumbnail)
     */
    private void processVideoAsync(Video video) {
        // TODO: Implement async processing
        // This could include:
        // 1. Extract video metadata (duration, resolution, etc.)
        // 2. Generate thumbnail
        // 3. Validate video integrity
        // 4. Update video status to READY
        
        log.info("Starting async processing for video ID: {}", video.getId());
        
        // For now, just mark as ready after a delay (simulate processing)
        // In production, this should be handled by a queue system (e.g., SQS, RabbitMQ)
        try {
            // Simulate processing time
            Thread.sleep(1000);
            
            video.setStatus(VideoStatus.READY);
            video.setProcessingCompletedAt(LocalDateTime.now());
            video.setProcessingMessage("Processing completed successfully");
            
            // TODO: Set actual duration from video metadata
            video.setDurationSeconds(300); // Default 5 minutes
            
            videoRepository.save(video);
            
            log.info("Video processing completed for video ID: {}", video.getId());
            
        } catch (Exception e) {
            log.error("Video processing failed for video ID: {}", video.getId(), e);
            
            video.setStatus(VideoStatus.FAILED);
            video.setProcessingMessage("Processing failed: " + e.getMessage());
            videoRepository.save(video);
        }
    }
}