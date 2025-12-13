package com.elearning.bffservice.dto.request;

/**
 * Enum representing class type options for tutor search
 */
public enum ClassType {
    ALL("all"),
    ONE_ON_ONE("1-1"),
    GROUP("group");

    private final String value;

    ClassType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static ClassType fromValue(String value) {
        for (ClassType type : ClassType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        return ALL; // default
    }
}