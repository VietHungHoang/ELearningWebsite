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

/**
 * Response DTO for message details
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {

    private String id;

    private String conversationId;

    private String senderId;

    private MessageType type;

    private String content;

    private List<MessageAttachment> attachments;

    private MessageStatus status;

    private List<String> readBy;

    private Map<String, String> reactions;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime editedAt;

    private boolean isEdited;

    private String replyToMessageId;

    private MessageResponse replyToMessage;  // Nested message for context
}
