package com.elearning.tutorservice.enums;

import lombok.Getter;

@Getter
public enum ReviewViolationType {
    NONE(0, "No violation detected"),
    PROFANITY(1001, "Contains profanity or offensive language"),
    SPAM(1002, "Spam or repetitive content"),
    PERSONAL_INFO(1003, "Contains personal information"),
    HARASSMENT(1004, "Harassment or threatening language"),
    INAPPROPRIATE_CONTENT(1005, "Inappropriate or sexual content"),
    OFF_TOPIC(1006, "Off-topic or irrelevant content"),
    FAKE_REVIEW(1007, "Suspected fake or fraudulent review"),
    PROMOTIONAL(1008, "Contains promotional or advertising content");

    private final int code;
    private final String description;

    ReviewViolationType(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public static ReviewViolationType fromCode(int code) {
        for (ReviewViolationType type : values()) {
            if (type.code == code) {
                return type;
            }
        }
        return NONE;
    }
}
