package com.elearning.chatservice.service;

import com.elearning.chatservice.dto.request.CreateConversationRequest;
import com.elearning.chatservice.dto.response.ConversationResponse;
import com.elearning.chatservice.entity.Conversation;
import com.elearning.chatservice.entity.ConversationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ConversationService {

    ConversationResponse createConversation(CreateConversationRequest request, UUID createdBy);

    /**
     * Get or create one-to-one conversation
     */
    ConversationResponse getOrCreateOneToOneConversation(UUID userId1, UUID userId2);

    /**
     * Get conversation by ID
     */
    ConversationResponse getConversationById(UUID conversationId, UUID userId);

    /**
     * Get all conversations for a user
     */
    Page<ConversationResponse> getUserConversations(UUID userId, Pageable pageable);

    /**
     * Get conversations by type for a user
     */
    Page<ConversationResponse> getUserConversationsByType(UUID userId, ConversationType type, Pageable pageable);

    /**
     * Add participants to a group conversation
     */
    ConversationResponse addParticipants(UUID conversationId, List<UUID> participantIds, UUID requestUserId);

    /**
     * Remove participant from a group conversation
     */
    ConversationResponse removeParticipant(UUID conversationId, UUID participantId, UUID requestUserId);

    /**
     * Update conversation (name, etc.)
     */
    ConversationResponse updateConversation(UUID conversationId, String name, UUID userId);

    /**
     * Delete conversation (soft delete)
     */
    void deleteConversation(UUID conversationId, UUID userId);

    /**
     * Search conversations by name
     */
    Page<ConversationResponse> searchConversations(UUID userId, String searchText, Pageable pageable);

    /**
     * Update last message in conversation
     */
    void updateLastMessage(UUID conversationId, UUID messageId);
}
