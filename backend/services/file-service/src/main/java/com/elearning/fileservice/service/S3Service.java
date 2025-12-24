package com.elearning.fileservice.service;

import com.elearning.fileservice.config.StorageInfo;
import com.elearning.fileservice.dto.response.PresignedUrlResponse;
import software.amazon.awssdk.services.s3.model.UploadPartRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.util.List;

/**
 * S3 Service interface - main service for handling S3 operations
 * Uses strategies to determine logic for different media types
 */
public interface S3Service {
    
    /**
     * Generate object key using appropriate strategy based on content type
     * @param contentType the content type of the file
     * @return unique object key for S3 storage
     */
    String generateObjectKey(String contentType);

    String generateObjectUrl(StorageInfo storageInfo, String objectKey);
    
    /**
     * Generate presigned URL using appropriate strategy based on content type
     * @param contentType the content type of the file
     * @return PresignedUrlResponse containing all necessary URLs and metadata
     */
    PresignedUrlResponse generatePresignedUrl(String contentType);

    /**
     * Generate upload ID for multipart upload
     * @param videoKey the S3 object key for the video
     * @return AWS multipart upload ID
     */
    public String getUploadIDForMultipartUpload(StorageInfo storageInfo, String videoKey);
    
    /**
     * Generate presigned URL for upload part in multipart upload
     * @param presigner the S3 presigner instance
     * @param uploadPartRequest the upload part request containing bucket, key, uploadId, and partNumber
     * @return presigned URL string for uploading the part
     */
    String getPresignedUrlForUploadPart(S3Presigner presigner, UploadPartRequest uploadPartRequest);
    
    /**
     * Generate presigned URLs for all parts of a multipart upload
     * @param presigner the S3 presigner instance
     * @param bucketName the S3 bucket name
     * @param objectKey the S3 object key
     * @param uploadId the multipart upload ID
     * @param totalChunks total number of chunks/parts
     * @return List of presigned URLs for each part
     */
    List<String> getPresignedUrlsForMultipartUpload(StorageInfo storageInfo, String objectKey, String uploadId, int totalChunks);

    public void completeMultipartUpload(StorageInfo storageInfo, String videoKey, String uploadId, List<String> etags);


}
