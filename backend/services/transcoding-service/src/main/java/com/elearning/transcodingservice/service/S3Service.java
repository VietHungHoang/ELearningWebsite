package com.elearning.transcodingservice.service;

import java.nio.file.Path;

public interface S3Service {
    /**
     * Download object from S3 to local destination path
     * @param bucketName bucket name
     * @param objectKey object key
     * @param dest local destination path
     */
    void downloadObject(String bucketName, String objectKey, Path dest);

    /**
     * Upload object from local path to S3
     * @param bucketName bucket name
     * @param objectKey object key
     * @param source local source path
     */
    void uploadObject(String bucketName, String objectKey, Path source);

    /**
     * Upload all files from a directory to S3 bucket
     * @param bucketName bucket name
     * @param directory local directory path
     * @param baseKey base object key prefix
     */
    void uploadDirectory(String bucketName, Path directory, String baseKey);

    /**
     * Return configured VIDEO-RAW bucket name if available
     */
    default String getVideosRawBucketName() {
        return null;
    }

    /**
     * Return configured VIDEO-STREAM bucket name if available
     */
    default String getVideosStreamBucketName() {
        return null;
    }
}
