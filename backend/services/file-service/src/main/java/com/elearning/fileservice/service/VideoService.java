package com.elearning.fileservice.service;

import com.elearning.fileservice.dto.request.CompleteUploadRequest;
import com.elearning.fileservice.dto.request.InitiateUploadRequest;
import com.elearning.fileservice.dto.response.InitiateUploadResponse;
import com.elearning.fileservice.dto.response.VideoResponse;

/**
 * Video Service interface for managing video upload operations with presigned URLs
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
}