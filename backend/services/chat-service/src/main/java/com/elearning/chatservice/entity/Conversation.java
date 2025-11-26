package com.elearning.chatservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Conversation entity - represents a chat conversation (1-1 or group)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "conversations")
public class Conversation {

    @Id
    private String id;

    private String name;  // Group name (null for 1-1 chats)

    private ConversationType type;

    private List<String> participantIds;  // List of user IDs

    private String classId;  // Optional: if conversation is in context of a class

    private String lastMessageId;  // Reference to last message

    private LocalDateTime lastMessageAt;

    private String createdBy;  // User ID who created the conversation

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private boolean isActive;  // For soft delete

    public Conversation(String name, ConversationType type, List<String> participantIds, String createdBy) {
        this.name = name;
        this.type = type;
        this.participantIds = participantIds != null ? participantIds : new ArrayList<>();
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isActive = true;
    }
}
