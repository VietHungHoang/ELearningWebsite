package com.elearning.chatservice.dto.response;

import com.elearning.chatservice.entity.ConversationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO for conversation details
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {

    private UUID id;

    private String name;

    private ConversationType type;

    private List<UUID> participantIds;

    /**
     * Participant details with name and avatar from UserCache
     */
    private List<ParticipantUserInfo> participantDetails;

    private UUID classId;

    private MessageResponse lastMessage;

    private LocalDateTime lastMessageAt;

    private long unreadCount;

    private List<ParticipantResponse> typingUsers;

    private UUID createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
