package com.elearning.contentservice.enums;

public enum VideoStatus {
    UPLOADING,      // Đang upload chunks lên S3
    PROCESSING,     // Đang xử lý video (extract metadata, generate thumbnail)
    READY,          // Sẵn sàng để xem
    FAILED          // Upload hoặc processing thất bại
}
