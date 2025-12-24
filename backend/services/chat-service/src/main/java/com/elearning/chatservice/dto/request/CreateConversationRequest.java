package com.elearning.chatservice.dto.request;

import com.elearning.chatservice.entity.ConversationType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Request DTO for creating a new conversation
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateConversationRequest {

    private String name;  // Required for group chats, optional for 1-1

    @NotNull(message = "Conversation type is required")
    private ConversationType type;

    @NotEmpty(message = "At least one participant is required")
    private List<UUID> participantIds;

    private UUID classId;  // Optional: for class-based group chats
}
