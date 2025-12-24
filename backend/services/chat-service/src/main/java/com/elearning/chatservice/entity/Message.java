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
import java.util.Map;
import java.util.UUID;

/**
 * Message entity - represents a chat message
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
public class Message {

    @Id
    @Builder.Default
    private UUID id = UUID.randomUUID();

    private UUID conversationId;

    private UUID senderId;  // User ID of sender

    private MessageType type;

    private String content;  // Text content or file path

    private List<MessageAttachment> attachments;  // For multiple files

    private MessageStatus status;

    private List<UUID> readBy;  // List of user IDs who have read the message

    private Map<UUID, String> reactions;  // userId -> emoji

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime editedAt;

    private boolean isEdited;

    private boolean isDeleted;

    private UUID replyToMessageId;  // For reply functionality

    public Message(UUID conversationId, UUID senderId, MessageType type, String content) {
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.type = type;
        this.content = content;
        this.status = MessageStatus.SENT;
        this.readBy = new ArrayList<>();
        this.attachments = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isEdited = false;
        this.isDeleted = false;
    }
}
