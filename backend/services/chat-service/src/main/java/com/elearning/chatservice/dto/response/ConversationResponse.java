package com.elearning.chatservice.dto.response;

import com.elearning.chatservice.entity.ConversationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for conversation details
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {

    private String id;

    private String name;

    private ConversationType type;

    private List<String> participantIds;

    private String classId;

    private MessageResponse lastMessage;

    private LocalDateTime lastMessageAt;

    private long unreadCount;

    private List<ParticipantResponse> typingUsers;

    private String createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
