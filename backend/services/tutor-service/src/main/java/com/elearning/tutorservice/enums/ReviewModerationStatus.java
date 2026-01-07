package com.elearning.tutorservice.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReviewModerationStatus {
    APPROVED("Đã phê duyệt", true),

    // Pending statuses with specific reasons (waiting for manual review or edit)
    PENDING_PROFANITY("Chứa ngôn ngữ không phù hợp", false),
    PENDING_SPAM("Nội dung spam hoặc lặp lại", false),
    PENDING_PERSONAL_INFO("Chứa thông tin cá nhân", false),
    PENDING_HARASSMENT("Chứa nội dung quấy rối hoặc đe dọa", false),
    PENDING_INAPPROPRIATE("Chứa nội dung không phù hợp", false),
    PENDING_OFF_TOPIC("Nội dung không liên quan", false),
    PENDING_FAKE("Đánh giá giả mạo hoặc gian lận", false),
    PENDING_PROMOTIONAL("Chứa nội dung quảng cáo", false),
    PENDING_OTHER("Đang chờ kiểm duyệt", false),

    REJECTED("Bị từ chối", false);

    private final String description;
    private final boolean visible; // true = visible to all, false = visible to reviewer only

    /**
     * Map violation code from Gemini to pending status
     */
    public static ReviewModerationStatus fromViolationCode(int code) {
        return switch (code) {
            case 1001 -> PENDING_PROFANITY;
            case 1002 -> PENDING_SPAM;
            case 1003 -> PENDING_PERSONAL_INFO;
            case 1004 -> PENDING_HARASSMENT;
            case 1005 -> PENDING_INAPPROPRIATE;
            case 1006 -> PENDING_OFF_TOPIC;
            case 1007 -> PENDING_FAKE;
            case 1008 -> PENDING_PROMOTIONAL;
            default -> PENDING_OTHER;
        };
    }
}
