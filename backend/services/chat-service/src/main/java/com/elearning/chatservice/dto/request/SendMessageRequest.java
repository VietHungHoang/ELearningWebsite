package com.elearning.chatservice.dto.request;

import com.elearning.chatservice.entity.MessageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for sending a message
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {

    @NotBlank(message = "Conversation ID is required")
    private String conversationId;

    @NotNull(message = "Message type is required")
    private MessageType type;

    private String content;  // Can be null for file-only messages

    private String replyToMessageId;  // Optional: for reply functionality
}
