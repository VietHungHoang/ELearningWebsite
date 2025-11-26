package com.elearning.chatservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for adding reaction to a message
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddReactionRequest {

    @NotBlank(message = "Message ID is required")
    private String messageId;

    @NotBlank(message = "Emoji is required")
    private String emoji;
}
