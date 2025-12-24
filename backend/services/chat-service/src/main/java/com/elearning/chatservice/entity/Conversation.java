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
import java.util.UUID;

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
    @Builder.Default
    private UUID id = UUID.randomUUID();

    private String name;  // Group name (null for 1-1 chats)

    private ConversationType type;

    private List<UUID> participantIds;  // List of user IDs

    private UUID classId;  // Optional: if conversation is in context of a class

    private UUID lastMessageId;  // Reference to last message

    private LocalDateTime lastMessageAt;

    private UUID createdBy;  // User ID who created the conversation

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private boolean isActive;  // For soft delete

    public Conversation(String name, ConversationType type, List<UUID> participantIds, UUID createdBy) {
        this.name = name;
        this.type = type;
        this.participantIds = participantIds != null ? participantIds : new ArrayList<>();
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isActive = true;
    }
}
