package com.elearning.tutorservice.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ProficiencyLevel {
    BEGINNER,
    INTERMEDIATE,
    ADVANCED,
    FLUENT,
    NATIVE;

    @JsonCreator
    public static ProficiencyLevel fromString(String value) {
        if (value == null) {
            return null;
        }
        for (ProficiencyLevel level : ProficiencyLevel.values()) {
            if (level.name().equalsIgnoreCase(value)) {
                return level;
            }
        }
        throw new IllegalArgumentException("Unknown proficiency level: " + value);
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}