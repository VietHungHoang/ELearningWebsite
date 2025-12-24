package com.elearning.chatservice.service;

import com.elearning.chatservice.dto.response.ParticipantResponse;

import java.util.List;
import java.util.UUID;

public interface ParticipantService {

    /**
     * Update typing status
     */
    void updateTypingStatus(UUID conversationId, UUID userId, boolean isTyping);

    /**
     * Get typing participants in a conversation
     */
    List<ParticipantResponse> getTypingParticipants(UUID conversationId);

    /**
     * Update last seen time
     */
    void updateLastSeen(UUID conversationId, UUID userId);

    /**
     * Get participant info
     */
    ParticipantResponse getParticipant(UUID conversationId, UUID userId);

    /**
     * Get all participants in a conversation
     */
    List<ParticipantResponse> getConversationParticipants(UUID conversationId);

    /**
     * Check if user is participant
     */
    boolean isParticipant(UUID conversationId, UUID userId);
}
