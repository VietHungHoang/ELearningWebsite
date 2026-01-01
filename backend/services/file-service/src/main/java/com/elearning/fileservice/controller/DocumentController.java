package com.elearning.fileservice.controller;

import com.elearning.fileservice.dto.request.DocumentUploadRequest;
import com.elearning.fileservice.dto.response.ApiResponse;
import com.elearning.fileservice.dto.response.PresignedUrlResponse;

import com.elearning.fileservice.service.S3Service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/file/documents")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class DocumentController {
    
    private final S3Service s3Service;
    
    /**
     * Generate presigned URL for document upload
     */
    @PostMapping("/presigned-url")
    public ResponseEntity<ApiResponse<PresignedUrlResponse>> generatePresignedUrl(
            @Valid @RequestBody DocumentUploadRequest request) {
        
        log.info("Generating presigned URL for document upload with content type: {}", request.getContentType());
        
        try {
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