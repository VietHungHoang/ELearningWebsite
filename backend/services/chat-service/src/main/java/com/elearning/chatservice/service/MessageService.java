package com.elearning.chatservice.service;

import com.elearning.chatservice.dto.request.EditMessageRequest;
import com.elearning.chatservice.dto.request.SendMessageRequest;
import com.elearning.chatservice.dto.response.MessageResponse;
import com.elearning.chatservice.entity.Message;
import com.elearning.chatservice.entity.MessageType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface MessageService {

    /**
     * Send a text message
     */
    MessageResponse sendMessage(SendMessageRequest request, UUID senderId);

    /**
     * Send a message with file attachment
     */
    MessageResponse sendMessageWithFiles(SendMessageRequest request, List<MultipartFile> files, UUID senderId);

    /**
     * Get message by ID
     */
    MessageResponse getMessageById(UUID messageId, UUID userId);

    /**
     * Get message history in a conversation
     */
    Page<MessageResponse> getConversationMessages(UUID conversationId, UUID userId, Pageable pageable);

    /**
     * Edit a message
     */
    MessageResponse editMessage(EditMessageRequest request, UUID userId);

    /**
     * Delete a message
     */
    void deleteMessage(UUID messageId, UUID userId);

    /**
     * Mark message(s) as read
     */
    void markAsRead(UUID conversationId, UUID messageId, UUID userId);

    /**
     * Mark all messages in conversation as read
     */
    void markAllAsRead(UUID conversationId, UUID userId);

    /**
     * Get conversation ID by message ID
     */
    UUID getConversationIdByMessageId(UUID messageId);

    /**
     * Check if user is participant in conversation
     */
    boolean isUserParticipant(UUID conversationId, UUID userId);

    /**
     * Add reaction to a message
     */
    MessageResponse addReaction(UUID messageId, String emoji, UUID userId);

    /**
     * Remove reaction from a message
     */
    MessageResponse removeReaction(UUID messageId, UUID userId);

    /**
     * Get unread message count for a conversation
     */
    long getUnreadCount(UUID conversationId, UUID userId);

    /**
     * Search messages in a conversation
     */
    Page<MessageResponse> searchMessages(UUID conversationId, String searchText, UUID userId, Pageable pageable);

    /**
     * Get messages by type (images, files, etc.)
     */
    Page<MessageResponse> getMessagesByType(UUID conversationId, MessageType type, UUID userId, Pageable pageable);

    /**
     * Map message entity to response
     */
    MessageResponse mapToResponse(Message message);
}
