package com.elearning.tutorservice.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AvailabilityStatus {
    AVAILABLE,
    DELETED;

    @JsonCreator
    public static AvailabilityStatus fromString(String value) {
        if (value == null) {
            return null;
        }
        for (AvailabilityStatus status : AvailabilityStatus.values()) {
            if (status.name().equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown availability status: " + value);
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}