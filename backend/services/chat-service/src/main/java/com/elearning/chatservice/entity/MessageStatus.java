package com.elearning.chatservice.entity;

/**
 * Enum for message status
 */
public enum MessageStatus {
    SENT,           // Message sent
    DELIVERED,      // Message delivered to recipient
    READ,           // Message read by recipient
    DELETED,        // Message deleted
    EDITED          // Message edited
}
