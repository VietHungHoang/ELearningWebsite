package com.elearning.chatservice.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Request DTO for typing indicator
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TypingIndicatorRequest {

    @NotNull(message = "Conversation ID is required")
    private UUID conversationId;

    private boolean isTyping;
}
