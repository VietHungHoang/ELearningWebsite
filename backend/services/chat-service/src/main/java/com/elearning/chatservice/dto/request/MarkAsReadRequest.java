package com.elearning.chatservice.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Request DTO for marking messages as read
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarkAsReadRequest {

    @NotNull(message = "Conversation ID is required")
    private UUID conversationId;

    private UUID messageId;  // Optional: if null, mark all messages as read
}
