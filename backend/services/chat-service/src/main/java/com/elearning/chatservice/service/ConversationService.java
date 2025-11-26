package com.elearning.chatservice.service;

import com.elearning.chatservice.dto.request.CreateConversationRequest;
import com.elearning.chatservice.dto.response.ConversationResponse;
import com.elearning.chatservice.entity.Conversation;
import com.elearning.chatservice.entity.ConversationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ConversationService {

    /**
     * Create a new conversation
     */
    ConversationResponse createConversation(CreateConversationRequest request, String createdBy);

    /**
     * Get or create one-to-one conversation
     */
    ConversationResponse getOrCreateOneToOneConversation(String userId1, String userId2);

    /**
     * Get conversation by ID
     */
    ConversationResponse getConversationById(String conversationId, String userId);

    /**
     * Get all conversations for a user
     */
    Page<ConversationResponse> getUserConversations(String userId, Pageable pageable);

    /**
     * Get conversations by type for a user
     */
    Page<ConversationResponse> getUserConversationsByType(String userId, ConversationType type, Pageable pageable);

    /**
     * Add participants to a group conversation
     */
    ConversationResponse addParticipants(String conversationId, List<String> participantIds, String requestUserId);

    /**
     * Remove participant from a group conversation
     */
    ConversationResponse removeParticipant(String conversationId, String participantId, String requestUserId);

    /**
     * Update conversation (name, etc.)
     */
    ConversationResponse updateConversation(String conversationId, String name, String userId);

    /**
     * Delete conversation (soft delete)
     */
    void deleteConversation(String conversationId, String userId);

    /**
     * Search conversations by name
     */
    Page<ConversationResponse> searchConversations(String userId, String searchText, Pageable pageable);

    /**
     * Update last message in conversation
     */
    void updateLastMessage(String conversationId, String messageId);
}
