package com.elearning.fileservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.elearning.fileservice.dto.request.CompleteUploadRequest;
import com.elearning.fileservice.dto.request.InitiateUploadRequest;
import com.elearning.fileservice.dto.request.VideoUploadRequest;
import com.elearning.fileservice.dto.response.ApiResponse;
import com.elearning.fileservice.dto.response.InitiateUploadResponse;
import com.elearning.fileservice.dto.response.PresignedUrlResponse;
import com.elearning.fileservice.dto.response.VideoResponse;
import com.elearning.fileservice.service.S3Service;
import com.elearning.fileservice.service.VideoService;

@RestController
@RequestMapping("/api/v1/file/videos")
@RequiredArgsConstructor
@Slf4j
public class VideoController {
    
    private final S3Service s3Service;
    private final VideoService videoService;
    
    /**
     * Initiate multipart video upload
     */
    @PostMapping("/upload/initiate")
    public ResponseEntity<ApiResponse<InitiateUploadResponse>> initiateUpload(
            @Valid @RequestBody InitiateUploadRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        
        log.info("Initiating video upload for lesson {} by user {}", request.getLessonId(), userId);
        
        try {
            InitiateUploadResponse response = videoService.initiateUpload(request, userId);
            return ResponseEntity.ok(ApiResponse.success(response, "Upload initiated successfully"));
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid upload request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Invalid request", e.getMessage()));
            
        } catch (Exception e) {
            log.error("Error initiating upload", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Internal server error", "Failed to initiate upload"));
        }
    }
    
    /**
     * Complete multipart video upload
     */
    @PostMapping("/upload/complete")
    public ResponseEntity<ApiResponse<VideoResponse>> completeUpload(
            @Valid @RequestBody CompleteUploadRequest request) {
        
        log.info("Completing video upload for upload ID: {}", request.getUploadId());
        
        try {
            VideoResponse response = videoService.completeUpload(request);
            return ResponseEntity.ok(ApiResponse.success(response, "Upload completed successfully"));
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid complete upload request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Invalid request", e.getMessage()));
            
        } catch (Exception e) {
            log.error("Error completing upload", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Internal server error", "Failed to complete upload"));
        }
    }
    
    /**
     * Get upload status by upload ID
     */
    @GetMapping("/upload/status/{uploadId}")
    public ResponseEntity<ApiResponse<VideoResponse>> getUploadStatus(@PathVariable String uploadId) {
        log.info("Getting upload status for upload ID: {}", uploadId);
        
        try {
            VideoResponse response = videoService.getUploadStatus(uploadId);
            return ResponseEntity.ok(ApiResponse.success(response, "Upload status retrieved successfully"));
            
        } catch (Exception e) {
            log.error("Error getting upload status for upload ID: {}", uploadId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(404, "Not found", "Upload not found"));
        }
    }
    
    /**
     * Generate presigned URL for video upload (legacy endpoint)
     */
    @PostMapping("/presigned-url")
    public ResponseEntity<ApiResponse<PresignedUrlResponse>> generatePresignedUrl(
            @Valid @RequestBody VideoUploadRequest request) {
        
        log.info("Generating presigned URL for video upload of lesson ID {} with content type: {}", 
                request.getCourseId(), request.getContentType());
        
        try {
            // Use S3Service to generate presigned URL with automatic strategy selection
            PresignedUrlResponse response = s3Service.generatePresignedUrl(request.getContentType());
            
            return ResponseEntity.ok(ApiResponse.success(response, "Presigned URL generated successfully"));
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid request for presigned URL: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Invalid request", e.getMessage()));
            
        } catch (Exception e) {
            log.error("Error generating presigned URL", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Internal server error", "Failed to generate presigned URL"));
        }
    }
}
