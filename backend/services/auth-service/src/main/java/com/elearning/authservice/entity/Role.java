package com.elearning.authservice.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {
    STUDENT,
    TUTOR,
    ADMIN;

    @JsonCreator
    public static Role fromString(String value) {
        if (value == null) {
            return null;
        }
        switch (value.toUpperCase()) {
            case "STUDENT":
                return STUDENT;
            case "TUTOR":
                return TUTOR;
            case "ADMIN":
                return ADMIN;
            default:
                throw new IllegalArgumentException("Unknown role: " + value);
        }
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}