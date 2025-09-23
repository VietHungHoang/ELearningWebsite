package com.elearning.mediaservice.controller;

import com.elearning.mediaservice.dto.request.ImageUploadRequest;
import com.elearning.mediaservice.dto.response.ApiResponse;
import com.elearning.mediaservice.dto.response.ImageUploadResponse;
import com.elearning.mediaservice.dto.response.PresignedUrlResponse;
import com.elearning.mediaservice.service.ImageService;
import com.elearning.mediaservice.service.S3Service;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ImageController {
    
    private final S3Service s3Service;
    private final ImageService imageService;
    
    /**
     * Generate presigned URL for image upload
     */
    @PostMapping("/presigned-url")
    public ResponseEntity<ApiResponse<PresignedUrlResponse>> generatePresignedUrl(
            @Valid @RequestBody ImageUploadRequest request) {
        
        log.info("Generating presigned URL for image upload of course ID {}", request.getCourseId());
        
        try {
            // Generate unique image key using ImageService
            String imageKey = imageService.generateImageKey("course", request.getContentType());
            
            // Generate presigned URL
            String presignedUrl = s3Service.generateImagePresignedUrl(imageKey, request.getContentType());
            
            // Build response for presigned URL
            PresignedUrlResponse response = PresignedUrlResponse.builder()
                    .imageKey(imageKey)
                    .presignedUrl(presignedUrl)
                    .contentType(request.getContentType())
                    .courseId(request.getCourseId())
                    .expiresAt(LocalDateTime.now().plusMinutes(5)) // 5 minutes expiry
                    .description(request.getDescription())
                    .build();
            
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
    
    /**
     * Direct image upload via multipart form
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ImageUploadResponse>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("courseId") Long courseId,
            @RequestParam(value = "description", required = false) String description) {
        
        log.info("Direct image upload for course: {}, file: {}", courseId, file.getOriginalFilename());
        
        try {
            // Validate file using ImageService
            if (!imageService.isValidImage(file)) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error(400, "Invalid file", 
                                "File must be JPG, PNG, GIF, or WEBP and less than configured size limit"));
            }
            
            // Generate image key using ImageService
            String imageKey = imageService.generateImageKey("course", file.getContentType());
            
            // Upload to S3
            byte[] imageData = file.getBytes();
            String imageUrl = s3Service.uploadImage(imageData, imageKey, file.getContentType());
            
            // Build response with actual upload data
            ImageUploadResponse response = ImageUploadResponse.builder()
                    .imageKey(imageKey)
                    .imageUrl(imageUrl)
                    .contentType(file.getContentType())
                    .courseId(courseId)
                    .fileSize(file.getSize())
                    .status("UPLOADED")
                    .description(description)
                    .uploadedAt(LocalDateTime.now())
                    .build();
            
            return ResponseEntity.ok(ApiResponse.success(response, "Image uploaded successfully"));
            
        } catch (IOException e) {
            log.error("Error reading file data", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "File processing error", "Unable to process the uploaded file"));
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid file upload request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Invalid request", e.getMessage()));
            
        } catch (Exception e) {
            log.error("Error uploading image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Upload failed", "Failed to upload image"));
        }
    }
    
    /**
     * Delete image
     */
    @DeleteMapping("/{imageKey}")
    public ResponseEntity<ApiResponse<String>> deleteImage(@PathVariable String imageKey) {
        log.info("Deleting image: {}", imageKey);
        
        try {
            s3Service.deleteImage(imageKey);
            return ResponseEntity.ok(ApiResponse.success("Image deleted successfully", "Deleted"));
            
        } catch (Exception e) {
            log.error("Error deleting image: {}", imageKey, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Deletion failed", "Failed to delete image"));
        }
    }
    
    /**
     * Validate image file
     */
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Boolean>> validateImage(
            @RequestParam("file") MultipartFile file) {
        
        log.info("Validating image file: {} with size: {}", file.getOriginalFilename(), file.getSize());
        
        boolean isValid = imageService.isValidImage(file);
        String message = isValid ? "File is valid" : "File is invalid";
        
        return ResponseEntity.ok(ApiResponse.success(isValid, message));
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Image service is healthy", "OK"));
    }
}
