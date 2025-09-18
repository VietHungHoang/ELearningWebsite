package com.elearning.contentservice.service;

import com.elearning.contentservice.dto.request.CompleteUploadRequest;
import com.elearning.contentservice.dto.request.InitiateUploadRequest;
import com.elearning.contentservice.dto.response.InitiateUploadResponse;
import com.elearning.contentservice.dto.response.VideoResponse;
import com.elearning.contentservice.enums.VideoStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VideoService {
    
    // Upload management
    InitiateUploadResponse initiateUpload(InitiateUploadRequest request, Long uploadedBy);
    VideoResponse completeUpload(CompleteUploadRequest request);
    VideoResponse getUploadStatus(String uploadId);
    
    // Video CRUD
    VideoResponse getVideoById(Long id);
    List<VideoResponse> getVideosByLesson(Long lessonId);
    Page<VideoResponse> getVideosByLesson(Long lessonId, Pageable pageable);
    VideoResponse updateVideo(Long id, InitiateUploadRequest request);
    void deleteVideo(Long id);
    
    // Video queries
    List<VideoResponse> getVideosByStatus(VideoStatus status);
    Page<VideoResponse> getVideosByUploader(Long uploadedBy, Pageable pageable);
    List<VideoResponse> getPreviewVideos();
    
    // Statistics
    long countVideosByLesson(Long lessonId);
    long countVideosByStatus(VideoStatus status);
    
    // Processing
    void processVideo(Long videoId);
    List<VideoResponse> getVideosNeedingProcessing();
}
