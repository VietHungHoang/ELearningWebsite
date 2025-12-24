package com.elearning.fileservice.service;

import com.elearning.fileservice.dto.request.CompleteUploadRequest;
import com.elearning.fileservice.dto.request.InitiateUploadRequest;
import com.elearning.fileservice.dto.response.InitiateUploadResponse;
import com.elearning.fileservice.dto.response.VideoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Video Service interface for managing video operations
 */
public interface VideoService {
    
    /**
     * Initiate multipart upload for a video
     * @param request the upload request containing video metadata
     * @param uploadedBy the user ID who uploads the video
     * @return InitiateUploadResponse containing upload ID and presigned URLs
     */
    InitiateUploadResponse initiateUpload(InitiateUploadRequest request, Long uploadedBy);
    
    /**
     * Complete multipart upload for a video
     * @param request the complete upload request containing upload ID and ETags
     * @return VideoResponse containing the completed video information
     */
    VideoResponse completeUpload(CompleteUploadRequest request);
    
    /**
     * Get upload status by upload ID
     * @param uploadId the AWS multipart upload ID
     * @return VideoResponse containing current upload status
     */
    VideoResponse getUploadStatus(String uploadId);
    
    /**
     * Get video by ID
     * @param id the video ID
     * @return VideoResponse containing video information
     */
    VideoResponse getVideoById(Long id);
    
    /**
     * Get videos by lesson ID
     * @param lessonId the lesson ID
     * @return List of VideoResponse
     */
    List<VideoResponse> getVideosByLessonId(Long lessonId);
    
    /**
     * Get videos by lesson ID with pagination
     * @param lessonId the lesson ID
     * @param pageable pagination information
     * @return Page of VideoResponse
     */
    Page<VideoResponse> getVideosByLessonIdPaginated(Long lessonId, Pageable pageable);
    
    /**
     * Update video information
     * @param id the video ID
     * @param title new title
     * @param description new description
     * @param isPreview preview status
     * @return updated VideoResponse
     */
    VideoResponse updateVideo(Long id, String title, String description, Boolean isPreview);
    
    /**
     * Delete video (soft delete)
     * @param id the video ID
     */
    void deleteVideo(Long id);
    
    /**
     * Get videos by status
     * @param status the video status
     * @param pageable pagination information
     * @return Page of VideoResponse
     */
    Page<VideoResponse> getVideosByStatus(String status, Pageable pageable);
    
    /**
     * Get videos by uploader ID
     * @param uploaderId the uploader user ID
     * @param pageable pagination information
     * @return Page of VideoResponse
     */
    Page<VideoResponse> getVideosByUploaderId(Long uploaderId, Pageable pageable);
    
    /**
     * Get preview videos (free content)
     * @param pageable pagination information
     * @return Page of VideoResponse
     */
    Page<VideoResponse> getPreviewVideos(Pageable pageable);
    
    /**
     * Count videos by lesson ID
     * @param lessonId the lesson ID
     * @return number of videos
     */
    Long countVideosByLessonId(Long lessonId);
    
    /**
     * Count videos by status
     * @param status the video status
     * @return number of videos
     */
    Long countVideosByStatus(String status);
    
    /**
     * Trigger manual processing for a video
     * @param id the video ID
     */
    void processVideo(Long id);
    
    /**
     * Get videos pending processing
     * @param pageable pagination information
     * @return Page of VideoResponse
     */
    Page<VideoResponse> getPendingProcessingVideos(Pageable pageable);
}