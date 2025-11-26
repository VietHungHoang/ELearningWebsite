package com.elearning.chatservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for participant details
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantResponse {

    private String id;

    private String conversationId;

    private String userId;

    private boolean isTyping;

    private LocalDateTime lastSeenAt;

    private LocalDateTime joinedAt;

    private boolean isMuted;

    private boolean isAdmin;
}
