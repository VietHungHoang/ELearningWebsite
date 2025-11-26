package com.elearning.chatservice.entity;

/**
 * Enum for message types
 */
public enum MessageType {
    TEXT,           // Plain text message
    IMAGE,          // Image file
    VIDEO,          // Video file
    FILE,           // Other file types
    SYSTEM          // System message (user joined, left, etc.)
}
