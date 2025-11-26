package com.elearning.chatservice.service;

import com.elearning.chatservice.dto.response.ParticipantResponse;

import java.util.List;

public interface ParticipantService {

    /**
     * Update typing status
     */
    void updateTypingStatus(String conversationId, String userId, boolean isTyping);

    /**
     * Get typing participants in a conversation
     */
    List<ParticipantResponse> getTypingParticipants(String conversationId);

    /**
     * Update last seen time
     */
    void updateLastSeen(String conversationId, String userId);

    /**
     * Get participant info
     */
    ParticipantResponse getParticipant(String conversationId, String userId);

    /**
     * Get all participants in a conversation
     */
    List<ParticipantResponse> getConversationParticipants(String conversationId);

    /**
     * Check if user is participant
     */
    boolean isParticipant(String conversationId, String userId);
}
