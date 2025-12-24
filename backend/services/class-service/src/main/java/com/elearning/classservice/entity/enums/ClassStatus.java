package com.elearning.classservice.entity.enums;

public enum ClassStatus {
    CREATED,       // Mới tạo
    DRAFT,         // Nháp
    OPENING,       // Đang mở đăng ký
    PUBLISHED,     // Đã công bố, chờ học sinh đăng ký
    IN_PROGRESS,   // Đang học
    COMPLETED,     // Đã hoàn thành
    CANCELLED      // Đã hủy
}
