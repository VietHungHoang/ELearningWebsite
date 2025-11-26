package com.elearning.chatservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Participant entity - represents user participation in a conversation
 * Used for tracking typing status and last seen
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "participants")
public class Participant {

    @Id
    private String id;

    private String conversationId;

    private String userId;

    private boolean isTyping;

    private LocalDateTime lastTypingAt;

    private LocalDateTime lastSeenAt;

    private LocalDateTime joinedAt;

    private boolean isMuted;

    private boolean isAdmin;  // For group chats

    public Participant(String conversationId, String userId) {
        this.conversationId = conversationId;
        this.userId = userId;
        this.isTyping = false;
        this.joinedAt = LocalDateTime.now();
        this.lastSeenAt = LocalDateTime.now();
        this.isMuted = false;
        this.isAdmin = false;
    }
}
