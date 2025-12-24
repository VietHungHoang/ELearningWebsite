package com.elearning.fileservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

import java.util.List;

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
     * Get video by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VideoResponse>> getVideoById(@PathVariable Long id) {
        log.info("Getting video by ID: {}", id);
        
        try {
            VideoResponse response = videoService.getVideoById(id);
            return ResponseEntity.ok(ApiResponse.success(response, "Video retrieved successfully"));
            
        } catch (Exception e) {
            log.error("Error getting video by ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(404, "Not found", "Video not found"));
        }
    }
    
    /**
     * Get videos by lesson ID
     */
    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<ApiResponse<List<VideoResponse>>> getVideosByLessonId(@PathVariable Long lessonId) {
        log.info("Getting videos for lesson ID: {}", lessonId);
        
        try {
            List<VideoResponse> response = videoService.getVideosByLessonId(lessonId);
            return ResponseEntity.ok(ApiResponse.success(response, "Videos retrieved successfully"));
            
        } catch (Exception e) {
            log.error("Error getting videos for lesson ID: {}", lessonId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Internal server error", "Failed to retrieve videos"));
        }
    }
    
    /**
     * Get videos by lesson ID with pagination
     */
    @GetMapping("/lesson/{lessonId}/paginated")
    public ResponseEntity<ApiResponse<Page<VideoResponse>>> getVideosByLessonIdPaginated(
            @PathVariable Long lessonId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        
        log.info("Getting paginated videos for lesson ID: {} (page: {}, size: {})", lessonId, page, size);
        
        try {
            Sort.Direction sortDirection = Sort.Direction.fromString(direction);
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
            
            Page<VideoResponse> response = videoService.getVideosByLessonIdPaginated(lessonId, pageable);
            return ResponseEntity.ok(ApiResponse.success(response, "Videos retrieved successfully"));
            
        } catch (Exception e) {
            log.error("Error getting paginated videos for lesson ID: {}", lessonId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Internal server error", "Failed to retrieve videos"));
        }
    }
    
    /**
     * Update video information
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VideoResponse>> updateVideo(
            @PathVariable Long id,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Boolean isPreview) {
        
        log.info("Updating video ID: {}", id);
        
        try {
            VideoResponse response = videoService.updateVideo(id, title, description, isPreview);
            return ResponseEntity.ok(ApiResponse.success(response, "Video updated successfully"));
            
        } catch (Exception e) {
            log.error("Error updating video ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(404, "Not found", "Video not found"));
        }
    }
    
    /**
     * Delete video (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVideo(@PathVariable Long id) {
        log.info("Deleting video ID: {}", id);
        
        try {
            videoService.deleteVideo(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Video deleted successfully"));
            
        } catch (Exception e) {
            log.error("Error deleting video ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(404, "Not found", "Video not found"));
        }
    }
    
    /**
     * Get videos by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<Page<VideoResponse>>> getVideosByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Getting videos by status: {}", status);
        
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            Page<VideoResponse> response = videoService.getVideosByStatus(status, pageable);
            return ResponseEntity.ok(ApiResponse.success(response, "Videos retrieved successfully"));
            
        } catch (Exception e) {
            log.error("Error getting videos by status: {}", status, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Internal server error", "Failed to retrieve videos"));
        }
    }
    
    /**
     * Get videos by uploader ID
     */
    @GetMapping("/uploader/{uploaderId}")
    public ResponseEntity<ApiResponse<Page<VideoResponse>>> getVideosByUploaderId(
            @PathVariable Long uploaderId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Getting videos by uploader ID: {}", uploaderId);
        
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            Page<VideoResponse> response = videoService.getVideosByUploaderId(uploaderId, pageable);
            return ResponseEntity.ok(ApiResponse.success(response, "Videos retrieved successfully"));
            
        } catch (Exception e) {
            log.error("Error getting videos by uploader ID: {}", uploaderId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Internal server error", "Failed to retrieve videos"));
        }
    }
    
    /**
     * Get preview videos (free content)
     */
    @GetMapping("/preview")
    public ResponseEntity<ApiResponse<Page<VideoResponse>>> getPreviewVideos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Getting preview videos");
        
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            Page<VideoResponse> response = videoService.getPreviewVideos(pageable);
            return ResponseEntity.ok(ApiResponse.success(response, "Preview videos retrieved successfully"));
            
        } catch (Exception e) {
            log.error("Error getting preview videos", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Internal server error", "Failed to retrieve preview videos"));
        }
    }
    
    /**
     * Count videos by lesson ID
     */
    @GetMapping("/count/lesson/{lessonId}")
    public ResponseEntity<ApiResponse<Long>> countVideosByLessonId(@PathVariable Long lessonId) {
        log.info("Counting videos for lesson ID: {}", lessonId);
        
        try {
            Long count = videoService.countVideosByLessonId(lessonId);
            return ResponseEntity.ok(ApiResponse.success(count, "Video count retrieved successfully"));
            
        } catch (Exception e) {
            log.error("Error counting videos for lesson ID: {}", lessonId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Internal server error", "Failed to count videos"));
        }
    }
    
    /**
     * Count videos by status
     */
    @GetMapping("/count/status/{status}")
    public ResponseEntity<ApiResponse<Long>> countVideosByStatus(@PathVariable String status) {
        log.info("Counting videos by status: {}", status);
        
        try {
            Long count = videoService.countVideosByStatus(status);
            return ResponseEntity.ok(ApiResponse.success(count, "Video count retrieved successfully"));
            
        } catch (Exception e) {
            log.error("Error counting videos by status: {}", status, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Internal server error", "Failed to count videos"));
        }
    }
    
    /**
     * Trigger manual processing for a video
     */
    @PostMapping("/{id}/process")
    public ResponseEntity<ApiResponse<Void>> processVideo(@PathVariable Long id) {
        log.info("Triggering manual processing for video ID: {}", id);
        
        try {
            videoService.processVideo(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Video processing triggered successfully"));
            
        } catch (Exception e) {
            log.error("Error triggering processing for video ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(404, "Not found", "Video not found"));
        }
    }
    
    /**
     * Get videos pending processing
     */
    @GetMapping("/processing/pending")
    public ResponseEntity<ApiResponse<Page<VideoResponse>>> getPendingProcessingVideos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Getting videos pending processing");
        
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
            Page<VideoResponse> response = videoService.getPendingProcessingVideos(pageable);
            return ResponseEntity.ok(ApiResponse.success(response, "Pending videos retrieved successfully"));
            
        } catch (Exception e) {
            log.error("Error getting pending processing videos", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Internal server error", "Failed to retrieve pending videos"));
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
