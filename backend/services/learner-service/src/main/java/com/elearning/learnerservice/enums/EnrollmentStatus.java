package com.elearning.learnerservice.enums;

public enum EnrollmentStatus {
    ACTIVE,         // Đang học
    COMPLETED,      // Hoàn thành khóa học
    CANCELLED,      // Hủy khóa học (có thể refund)
    SUSPENDED,      // Tạm ngưng (vi phạm policy)
    EXPIRED         // Hết hạn (limited time courses)
}
