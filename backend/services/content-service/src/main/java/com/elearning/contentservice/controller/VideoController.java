package com.elearning.contentservice.controller;

import com.elearning.contentservice.dto.request.CompleteUploadRequest;
import com.elearning.contentservice.dto.request.InitiateUploadRequest;
import com.elearning.contentservice.dto.response.ApiResponse;
import com.elearning.contentservice.dto.response.InitiateUploadResponse;
import com.elearning.contentservice.dto.response.VideoResponse;
import com.elearning.contentservice.enums.VideoStatus;
import com.elearning.contentservice.service.VideoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Stack;

@RestController
@RequestMapping("/api/videos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class VideoController {
    
    private final VideoService videoService;
    
    // Upload Management
    @PostMapping("/upload/initiate")
    public ResponseEntity<ApiResponse<InitiateUploadResponse>> initiateUpload(
            @Valid @RequestBody InitiateUploadRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        
        InitiateUploadResponse response = videoService.initiateUpload(request, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "Upload initiated successfully"));
    }
    
    @PostMapping("/upload/complete")
    public ResponseEntity<ApiResponse<VideoResponse>> completeUpload(
            @Valid @RequestBody CompleteUploadRequest request) {
        
        VideoResponse response = videoService.completeUpload(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Upload completed successfully"));
    }
    
    @GetMapping("/upload/status/{uploadId}")
    public ResponseEntity<ApiResponse<VideoResponse>> getUploadStatus(
            @PathVariable String uploadId) {

        VideoResponse response = videoService.getUploadStatus(uploadId);
        return ResponseEntity.ok(ApiResponse.success(response, "Upload status retrieved successfully"));
    }
    
    // Video CRUD
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VideoResponse>> getVideoById(@PathVariable Long id) {
        VideoResponse response = videoService.getVideoById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Video retrieved successfully"));
    }
    
    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<ApiResponse<List<VideoResponse>>> getVideosByLesson(@PathVariable Long lessonId) {
        List<VideoResponse> response = videoService.getVideosByLesson(lessonId);
        return ResponseEntity.ok(ApiResponse.success(response, "Videos retrieved successfully"));
    }
    
    @GetMapping("/lesson/{lessonId}/paginated")
    public ResponseEntity<ApiResponse<Page<VideoResponse>>> getVideosByLessonPaginated(
            @PathVariable Long lessonId, Pageable pageable) {
        
        Page<VideoResponse> response = videoService.getVideosByLesson(lessonId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, "Videos retrieved successfully"));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VideoResponse>> updateVideo(
            @PathVariable Long id,
            @Valid @RequestBody InitiateUploadRequest request) {
        
        VideoResponse response = videoService.updateVideo(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Video updated successfully"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVideo(@PathVariable Long id) {
        videoService.deleteVideo(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Video deleted successfully"));
    }
    
    // Video Queries
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<VideoResponse>>> getVideosByStatus(@PathVariable VideoStatus status) {
        List<VideoResponse> response = videoService.getVideosByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(response, "Videos retrieved successfully"));
    }
    
    @GetMapping("/uploader/{uploaderId}")
    public ResponseEntity<ApiResponse<Page<VideoResponse>>> getVideosByUploader(
            @PathVariable Long uploaderId, Pageable pageable) {
        
        Page<VideoResponse> response = videoService.getVideosByUploader(uploaderId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, "Videos retrieved successfully"));
    }
    
    @GetMapping("/preview")
    public ResponseEntity<ApiResponse<List<VideoResponse>>> getPreviewVideos() {
        List<VideoResponse> response = videoService.getPreviewVideos();
        return ResponseEntity.ok(ApiResponse.success(response, "Preview videos retrieved successfully"));
    }
    
    // Statistics
    @GetMapping("/count/lesson/{lessonId}")
    public ResponseEntity<ApiResponse<Long>> countVideosByLesson(@PathVariable Long lessonId) {
        long count = videoService.countVideosByLesson(lessonId);
        return ResponseEntity.ok(ApiResponse.success(count, "Video count retrieved successfully"));
    }
    
    @GetMapping("/count/status/{status}")
    public ResponseEntity<ApiResponse<Long>> countVideosByStatus(@PathVariable VideoStatus status) {
        long count = videoService.countVideosByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(count, "Video count retrieved successfully"));
    }
    
    // Processing
    @PostMapping("/{id}/process")
    public ResponseEntity<ApiResponse<Void>> processVideo(@PathVariable Long id) {
        videoService.processVideo(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Video processing started"));
    }
    
    @GetMapping("/processing/pending")
    public ResponseEntity<ApiResponse<List<VideoResponse>>> getVideosNeedingProcessing() {
        List<VideoResponse> response = videoService.getVideosNeedingProcessing();
        return ResponseEntity.ok(ApiResponse.success(response, "Pending videos retrieved successfully"));
    }
}
