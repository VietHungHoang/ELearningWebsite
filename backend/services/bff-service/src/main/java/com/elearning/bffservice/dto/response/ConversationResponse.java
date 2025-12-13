package com.elearning.bffservice.dto.response;

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

    private String type;  // ConversationType as String

    private List<String> participantIds;

    private String classId;

    private Object lastMessage;  // MessageResponse as Object

    private LocalDateTime lastMessageAt;

    private long unreadCount;

    private List<Object> typingUsers;  // ParticipantResponse as Object

    private String createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}