package com.elearning.chat_service.dto.enums;

public enum MessageStatus {
    SENT, // Đã gửi
    DELIVERED, // Đã deliver đến recipient (khi online)
    READ // Đã được đọc
}
