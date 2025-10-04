package com.elearning.mediaservice.controller;

import com.elearning.mediaservice.dto.request.ImageUploadRequest;
import com.elearning.mediaservice.dto.response.ApiResponse;
import com.elearning.mediaservice.dto.response.ImageUploadResponse;
import com.elearning.mediaservice.dto.response.PresignedUrlResponse;


import com.elearning.mediaservice.service.S3Service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ImageController {
    
    private final S3Service s3Service;
    
    /**
     * Generate presigned URL for image upload
     */
    @PostMapping("/presigned-url")
    public ResponseEntity<ApiResponse<PresignedUrlResponse>> generatePresignedUrl(
            @Valid @RequestBody ImageUploadRequest request) {
        
        log.info("Generating presigned URL for image upload of course ID {}", request.getCourseId());
        
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
