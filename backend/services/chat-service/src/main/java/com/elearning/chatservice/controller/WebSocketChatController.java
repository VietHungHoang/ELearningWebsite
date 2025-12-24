package com.elearning.chatservice.controller;

import com.elearning.chatservice.dto.request.SendMessageRequest;
import com.elearning.chatservice.dto.request.TypingIndicatorRequest;
import com.elearning.chatservice.dto.response.MessageResponse;
import com.elearning.chatservice.dto.response.TypingIndicatorResponse;
import com.elearning.chatservice.service.ConversationService;
import com.elearning.chatservice.service.MessageService;
import com.elearning.chatservice.service.ParticipantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.UUID;

/**
 * WebSocket Controller for real-time chat features
 * 
 * Client sends messages to:
 * - /app/chat.sendMessage - Send a message
 * - /app/chat.typing - Update typing status
 * - /app/chat.read - Mark message as read
 * 
 * Client subscribes to:
 * - /topic/conversation/{conversationId} - Receive messages in a conversation
 * - /user/queue/private - Receive private notifications
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class WebSocketChatController {

    private final MessageService messageService;
    private final ParticipantService participantService;
    private final ConversationService conversationService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Send a message in real-time
     * Client sends to: /app/chat.sendMessage
     * Broadcast to: /topic/conversation/{conversationId}
     */
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload SendMessageRequest request, StompHeaderAccessor headerAccessor) {
        String userIdHeader = null;
        try {
            userIdHeader = headerAccessor.getFirstNativeHeader("X-User-Id");
            if (userIdHeader == null) {
                throw new IllegalArgumentException("X-User-Id header is required");
            }
            UUID userId = UUID.fromString(userIdHeader);
            log.info("WebSocket - Send message: userId={}, conversationId={}", userId, request.getConversationId());

            // Save message
            MessageResponse messageResponse = messageService.sendMessage(request, userId);

            // Broadcast message to all participants in the conversation
            messagingTemplate.convertAndSend(
                    "/topic/conversation/" + request.getConversationId(),
                    messageResponse
            );

            // Send conversation updated event to all participants
            var updatedConversation = conversationService.getConversationById(request.getConversationId(), userId);
            messagingTemplate.convertAndSend(
                    "/topic/conversation/" + request.getConversationId() + "/updated",
                    updatedConversation
            );

            log.info("Message broadcasted: messageId={}", messageResponse.getId());
        } catch (Exception e) {
            log.error("Error sending message via WebSocket", e);
            // Send error to user
            messagingTemplate.convertAndSendToUser(
                    userIdHeader,
                    "/queue/errors",
                    "Failed to send message: " + e.getMessage()
            );
        }
    }

    /**
     * Update typing status
     * Client sends to: /app/chat.typing
     * Broadcast to: /topic/conversation/{conversationId}/typing
     */
    @MessageMapping("/chat.typing")
    public void updateTypingStatus(@Payload TypingIndicatorRequest request, StompHeaderAccessor headerAccessor) {
        try {
            String userIdHeader = headerAccessor.getFirstNativeHeader("X-User-Id");
            if (userIdHeader == null) {
                throw new IllegalArgumentException("X-User-Id header is required");
            }
            UUID userId = UUID.fromString(userIdHeader);
            log.debug("WebSocket - Typing indicator: userId={}, conversationId={}, isTyping={}", 
                    userId, request.getConversationId(), request.isTyping());

            // Update typing status
            participantService.updateTypingStatus(request.getConversationId(), userId, request.isTyping());

            // Get all typing users
            var typingUsers = participantService.getTypingParticipants(request.getConversationId());
            List<UUID> typingUserIds = typingUsers.stream()
                    .map(p -> p.getUserId())
                    .filter(id -> !id.equals(userId))  // Exclude current user
                    .toList();

            // Broadcast typing status to conversation
            TypingIndicatorResponse response = TypingIndicatorResponse.builder()
                    .conversationId(request.getConversationId())
                    .typingUserIds(typingUserIds)
                    .build();

            messagingTemplate.convertAndSend(
                    "/topic/conversation/" + request.getConversationId() + "/typing",
                    response
            );
        } catch (Exception e) {
            log.error("Error updating typing status", e);
        }
    }

    /**
     * Mark message as read
     * Client sends to: /app/chat.read/{conversationId}/{messageId}
     * Broadcast to: /topic/conversation/{conversationId}/read
     */
    @MessageMapping("/chat.read/{conversationId}/{messageId}")
    public void markAsRead(
            @DestinationVariable String conversationId,
            @DestinationVariable String messageId,
            StompHeaderAccessor headerAccessor) {
        try {
            String userIdHeader = headerAccessor.getFirstNativeHeader("X-User-Id");
            if (userIdHeader == null) {
                throw new IllegalArgumentException("X-User-Id header is required");
            }
            UUID userId = UUID.fromString(userIdHeader);
            log.debug("WebSocket - Mark as read: userId={}, conversationId={}, messageId={}", 
                    userId, conversationId, messageId);

            // Mark message as read
            messageService.markAsRead(UUID.fromString(conversationId), UUID.fromString(messageId), userId);

            // Update last seen
            participantService.updateLastSeen(UUID.fromString(conversationId), userId);

            // Broadcast read receipt to conversation
            messagingTemplate.convertAndSend(
                    "/topic/conversation/" + conversationId + "/read",
                    new ReadReceipt(messageId, userId)
            );

            // Send conversation updated event to all participants
            var updatedConversation = conversationService.getConversationById(UUID.fromString(conversationId), userId);
            messagingTemplate.convertAndSend(
                    "/topic/conversation/" + conversationId + "/updated",
                    updatedConversation
            );
        } catch (Exception e) {
            log.error("Error marking message as read", e);
        }
    }

    /**
     * User joined conversation (for presence)
     * Client sends to: /app/chat.join/{conversationId}
     */
    @MessageMapping("/chat.join/{conversationId}")
    public void userJoined(@DestinationVariable String conversationId, StompHeaderAccessor headerAccessor) {
        try {
            String userIdHeader = headerAccessor.getFirstNativeHeader("X-User-Id");
            if (userIdHeader == null) {
                throw new IllegalArgumentException("X-User-Id header is required");
            }
            UUID userId = UUID.fromString(userIdHeader);
            log.info("WebSocket - User joined: userId={}, conversationId={}", userId, conversationId);

            // Update last seen
            participantService.updateLastSeen(UUID.fromString(conversationId), userId);

            // Broadcast user joined event
            messagingTemplate.convertAndSend(
                    "/topic/conversation/" + conversationId + "/presence",
                    new PresenceEvent(userId, "JOINED")
            );
        } catch (Exception e) {
            log.error("Error handling user joined", e);
        }
    }

    /**
     * User left conversation (for presence)
     * Client sends to: /app/chat.leave/{conversationId}
     */
    @MessageMapping("/chat.leave/{conversationId}")
    public void userLeft(@DestinationVariable String conversationId, StompHeaderAccessor headerAccessor) {
        try {
            String userIdHeader = headerAccessor.getFirstNativeHeader("X-User-Id");
            if (userIdHeader == null) {
                throw new IllegalArgumentException("X-User-Id header is required");
            }
            UUID userId = UUID.fromString(userIdHeader);
            log.info("WebSocket - User left: userId={}, conversationId={}", userId, conversationId);

            // Update last seen
            participantService.updateLastSeen(UUID.fromString(conversationId), userId);

            // Clear typing status
            participantService.updateTypingStatus(UUID.fromString(conversationId), userId, false);

            // Broadcast user left event
            messagingTemplate.convertAndSend(
                    "/topic/conversation/" + conversationId + "/presence",
                    new PresenceEvent(userId, "LEFT")
            );
        } catch (Exception e) {
            log.error("Error handling user left", e);
        }
    }

    // Helper classes for WebSocket messages
    public record ReadReceipt(String messageId, UUID userId) {}
    public record PresenceEvent(UUID userId, String status) {}
}
