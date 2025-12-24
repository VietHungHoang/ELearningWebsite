package com.elearning.chatservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Request DTO for editing a message
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditMessageRequest {

    @NotNull(message = "Message ID is required")
    private UUID messageId;

    @NotBlank(message = "New content is required")
    private String newContent;
}
