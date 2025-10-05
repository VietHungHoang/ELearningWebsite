package com.elearning.transcodingservice.enums;

/**
 * Enumeration for video processing status
 */
public enum VideoStatus {
    UPLOADED,      // Video has been uploaded to S3
    PROCESSING,    // Video is being transcoded
    READY,         // Video is ready for streaming
    FAILED         // Video processing failed
}