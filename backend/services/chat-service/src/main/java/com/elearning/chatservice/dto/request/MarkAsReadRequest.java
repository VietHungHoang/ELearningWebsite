package com.elearning.chatservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for marking messages as read
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarkAsReadRequest {

    @NotBlank(message = "Conversation ID is required")
    private String conversationId;

    private String messageId;  // Optional: if null, mark all messages as read
}
