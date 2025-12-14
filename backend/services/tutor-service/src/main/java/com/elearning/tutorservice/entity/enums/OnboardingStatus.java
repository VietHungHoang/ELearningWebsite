package com.elearning.tutorservice.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum OnboardingStatus {
    PENDING,
    APPROVED,
    REJECTED,
    NEEDS_REVISION;

    @JsonCreator
    public static OnboardingStatus fromString(String value) {
        if (value == null) {
            return null;
        }
        for (OnboardingStatus status : OnboardingStatus.values()) {
            if (status.name().equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown onboarding status: " + value);
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}