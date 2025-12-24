package com.elearning.chatservice.dto.response;

import com.elearning.chatservice.entity.MessageAttachment;
import com.elearning.chatservice.entity.MessageStatus;
import com.elearning.chatservice.entity.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Response DTO for message details
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {

    private UUID id;

    private UUID conversationId;

    private UUID senderId;

    private MessageType type;

    private String content;

    private List<MessageAttachment> attachments;

    private MessageStatus status;

    private List<UUID> readBy;

    private Map<UUID, String> reactions;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime editedAt;

    private boolean isEdited;

    private UUID replyToMessageId;

    private MessageResponse replyToMessage;  // Nested message for context
}
