package com.elearning.chatservice.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Request DTO for adding reaction to a message
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddReactionRequest {

    @NotNull(message = "Message ID is required")
    private UUID messageId;

    @NotNull(message = "Emoji is required")
    private String emoji;
}
