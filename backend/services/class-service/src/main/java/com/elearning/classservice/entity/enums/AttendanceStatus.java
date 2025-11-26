package com.elearning.classservice.entity.enums;

/**
 * Trạng thái tham dự của học viên trong phiên học
 */
public enum AttendanceStatus {
    REGISTERED,  // Đã đăng ký nhưng chưa join
    PRESENT,     // Đã tham gia
    ABSENT,      // Vắng mặt
    LATE,        // Tham gia muộn
    LEFT_EARLY   // Rời sớm
}
