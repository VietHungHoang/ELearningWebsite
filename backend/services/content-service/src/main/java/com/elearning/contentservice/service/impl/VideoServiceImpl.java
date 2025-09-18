package com.elearning.contentservice.service.impl;

import com.elearning.contentservice.dto.request.CompleteUploadRequest;
import com.elearning.contentservice.dto.request.InitiateUploadRequest;
import com.elearning.contentservice.dto.response.InitiateUploadResponse;
import com.elearning.contentservice.dto.response.VideoResponse;
import com.elearning.contentservice.enums.VideoStatus;
import com.elearning.contentservice.exception.VideoNotFoundException;
import com.elearning.contentservice.mapper.VideoMapper;
import com.elearning.contentservice.model.Video;
import com.elearning.contentservice.repository.VideoRepository;
import com.elearning.contentservice.service.VideoService;
import com.elearning.contentservice.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class VideoServiceImpl implements VideoService {
    
    private final VideoRepository videoRepository;
    private final S3Service s3Service;
    
    private static final int CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
    
    @Override
    @Transactional
    public InitiateUploadResponse initiateUpload(InitiateUploadRequest request, Long uploadedBy) {
        // Calculate chunks
        int totalChunks = (int) Math.ceil((double) request.getFileSize() / CHUNK_SIZE);

        String key = "videos/" + UUID.randomUUID() + "-" + request.getFileName();
        
        String uploadId = s3Service.getUploadId(key, "video/mp4", totalChunks);
        
        // Create video record
        Video video = Video.builder()
                .lessonId(request.getLessonId())
                .title(request.getTitle())
                .description(request.getDescription())
                .originalFileName(request.getFileName())
                .fileSize(request.getFileSize())
                .status(VideoStatus.UPLOADING)
                .uploadId(uploadId)
                .totalChunks(totalChunks)
                .uploadedChunks(0)
                .isPreview(request.getIsPreview())
                .uploadedBy(uploadedBy)
                .build();
        
        video = videoRepository.save(video);
        log.info("Created video record with ID: {} for upload: {}", video.getId(), uploadId);
        
        // Generate presigned URLs for each chunk
        List<String> presignedUrls = s3Service.generatePresignedUrls(key, uploadId, totalChunks);
        
        return InitiateUploadResponse.builder()
                .videoId(video.getId())
                .uploadId(uploadId)
                .presignedUrls(presignedUrls)
                .chunkSize(CHUNK_SIZE)
                .totalChunks(totalChunks)
                .build();
    }
    
    @Override
    @Transactional
    public VideoResponse completeUpload(CompleteUploadRequest request) {
        Video video = videoRepository.findByUploadId(request.getUploadId())
                .orElseThrow(() -> new VideoNotFoundException("Video not found with upload ID: " + request.getUploadId()));
        
        // Complete multipart upload on S3
        String videoUrl = s3Service.completeMultipartUpload(request.getUploadId(), request.getEtags());
        
        // Update video record
        video.setVideoUrl(videoUrl);
        video.setStatus(VideoStatus.PROCESSING);
        video.setUploadedChunks(video.getTotalChunks());
        video = videoRepository.save(video);
        
        log.info("Completed upload for video ID: {}, starting processing", video.getId());
        
        // Trigger async processing
        processVideoAsync(video.getId());
        
        return VideoMapper.toResponse(video);
    }
    
    @Override
    public VideoResponse getUploadStatus(String uploadId) {
        Video video = videoRepository.findByUploadId(uploadId)
                .orElseThrow(() -> new VideoNotFoundException("Video not found with upload ID: " + uploadId));
        
        return VideoMapper.toResponse(video);
    }
    
    @Override
    public VideoResponse getVideoById(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new VideoNotFoundException("Video not found with id: " + id));
        return VideoMapper.toResponse(video);
    }
    
    @Override
    public List<VideoResponse> getVideosByLesson(Long lessonId) {
        return null;
        // return videoRepository.findByLessonIdAndIsActiveTrueOrderByCreatedAsc(lessonId)
        //         .stream()
        //         .map(VideoMapper::toResponse)
        //         .collect(Collectors.toList());
    }
    
    @Override
    public Page<VideoResponse> getVideosByLesson(Long lessonId, Pageable pageable) {
        return null;
        // return videoRepository.findByLessonIdAndIsActiveTrueOrderByCreatedAsc(lessonId, pageable)
        //         .map(VideoMapper::toResponse);
    }
    
    @Override
    @Transactional
    public VideoResponse updateVideo(Long id, InitiateUploadRequest request) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new VideoNotFoundException("Video not found with id: " + id));
        
        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setIsPreview(request.getIsPreview());
        
        video = videoRepository.save(video);
        return VideoMapper.toResponse(video);
    }
    
    @Override
    @Transactional
    public void deleteVideo(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new VideoNotFoundException("Video not found with id: " + id));
        
        video.setIsActive(false);
        videoRepository.save(video);
        
        log.info("Soft deleted video with ID: {}", id);
    }
    
    @Override
    public List<VideoResponse> getVideosByStatus(VideoStatus status) {
        return videoRepository.findByStatus(status)
                .stream()
                .map(VideoMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Page<VideoResponse> getVideosByUploader(Long uploadedBy, Pageable pageable) {
        return videoRepository.findByUploadedByAndIsActiveTrueOrderByCreatedAtDesc(uploadedBy, pageable)
                .map(VideoMapper::toResponse);
    }
    
    @Override
    public List<VideoResponse> getPreviewVideos() {
        return videoRepository.findByIsPreviewTrueAndStatusAndIsActiveTrueOrderByCreatedAtDesc(VideoStatus.READY)
                .stream()
                .map(VideoMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public long countVideosByLesson(Long lessonId) {
        return videoRepository.countByLessonIdAndIsActiveTrue(lessonId);
    }
    
    @Override
    public long countVideosByStatus(VideoStatus status) {
        return videoRepository.countByStatus(status);
    }
    
    @Override
    @Transactional
    public void processVideo(Long videoId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new VideoNotFoundException("Video not found with id: " + videoId));
        
        try {
            video.setProcessingStartedAt(LocalDateTime.now());
            video = videoRepository.save(video);
            
            // Extract video metadata and generate thumbnail
            s3Service.processVideo(video.getVideoUrl(), video.getUploadId());
            
            // Update video with processed info
            video.setStatus(VideoStatus.READY);
            video.setProcessingCompletedAt(LocalDateTime.now());
            video.setThumbnailUrl(s3Service.getThumbnailUrl(video.getUploadId()));
            video.setDurationSeconds(s3Service.getVideoDuration(video.getVideoUrl()));
            
            videoRepository.save(video);
            log.info("Successfully processed video ID: {}", videoId);
            
        } catch (Exception e) {
            video.setStatus(VideoStatus.FAILED);
            video.setProcessingMessage(e.getMessage());
            videoRepository.save(video);
            log.error("Failed to process video ID: {}", videoId, e);
        }
    }
    
    @Async
    public void processVideoAsync(Long videoId) {
        processVideo(videoId);
    }
    
    @Override
    public List<VideoResponse> getVideosNeedingProcessing() {
        return videoRepository.findVideosNeedingProcessing(VideoStatus.PROCESSING)
                .stream()
                .map(VideoMapper::toResponse)
                .collect(Collectors.toList());
    }
}
