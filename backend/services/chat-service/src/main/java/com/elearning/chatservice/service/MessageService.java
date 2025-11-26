package com.elearning.chatservice.service;

import com.elearning.chatservice.dto.request.EditMessageRequest;
import com.elearning.chatservice.dto.request.SendMessageRequest;
import com.elearning.chatservice.dto.response.MessageResponse;
import com.elearning.chatservice.entity.MessageType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MessageService {

    /**
     * Send a text message
     */
    MessageResponse sendMessage(SendMessageRequest request, String senderId);

    /**
     * Send a message with file attachment
     */
    MessageResponse sendMessageWithFiles(SendMessageRequest request, List<MultipartFile> files, String senderId);

    /**
     * Get message by ID
     */
    MessageResponse getMessageById(String messageId, String userId);

    /**
     * Get message history in a conversation
     */
    Page<MessageResponse> getConversationMessages(String conversationId, String userId, Pageable pageable);

    /**
     * Edit a message
     */
    MessageResponse editMessage(EditMessageRequest request, String userId);

    /**
     * Delete a message
     */
    void deleteMessage(String messageId, String userId);

    /**
     * Mark message(s) as read
     */
    void markAsRead(String conversationId, String messageId, String userId);

    /**
     * Mark all messages in conversation as read
     */
    void markAllAsRead(String conversationId, String userId);

    /**
     * Add reaction to a message
     */
    MessageResponse addReaction(String messageId, String emoji, String userId);

    /**
     * Remove reaction from a message
     */
    MessageResponse removeReaction(String messageId, String userId);

    /**
     * Get unread message count for a conversation
     */
    long getUnreadCount(String conversationId, String userId);

    /**
     * Search messages in a conversation
     */
    Page<MessageResponse> searchMessages(String conversationId, String searchText, String userId, Pageable pageable);

    /**
     * Get messages by type (images, files, etc.)
     */
    Page<MessageResponse> getMessagesByType(String conversationId, MessageType type, String userId, Pageable pageable);
}
