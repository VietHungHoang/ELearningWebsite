package com.elearning.chat_service.controller;

import com.elearning.chat_service.dto.websocket.WebSocketMessageRequest;
import com.elearning.chat_service.dto.websocket.WebSocketMessageResponse;
import com.elearning.chat_service.service.ChatService;
import com.elearning.chat_service.service.PresenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;

@Slf4j
@Controller
@RequiredArgsConstructor
public class WebSocketChatController {

    private final ChatService chatService;
    private final PresenceService presenceService;

    /**
     * Xử lý tin nhắn từ client
     * Client gửi đến: /app/chat/conversations/{conversationId}/send
     * Broadcast đến: /topic/conversations/{conversationId}
     */
    @MessageMapping("/chat/conversations/{conversationId}/send")
    @SendTo("/topic/conversations/{conversationId}")
    public WebSocketMessageResponse sendMessage(
            @DestinationVariable String conversationId,
            WebSocketMessageRequest request) {

        // Validation
        if (request == null) {
            log.warn("Received null WebSocket message request for conversation: {}", conversationId);
            return WebSocketMessageResponse.builder()
                    .conversationId(conversationId)
                    .status("error")
                    .errorMessage("Request cannot be null")
                    .build();
        }

        if (!StringUtils.hasText(request.getSenderId())) {
            log.warn("Missing senderId in WebSocket message for conversation: {}", conversationId);
            return WebSocketMessageResponse.builder()
                    .conversationId(conversationId)
                    .status("error")
                    .errorMessage("Sender ID is required")
                    .build();
        }

        if (!StringUtils.hasText(request.getContent())) {
            log.warn("Empty content in WebSocket message for conversation: {}", conversationId);
            return WebSocketMessageResponse.builder()
                    .conversationId(conversationId)
                    .status("error")
                    .errorMessage("Message content cannot be empty")
                    .build();
        }

        try {
            log.info("Received WebSocket message for conversation: {} from user: {}",
                    conversationId, request.getSenderId());

            // Kiểm tra conversationId khớp
            if (!conversationId.equals(request.getConversationId())) {
                log.warn("Conversation ID mismatch: URL={}, Request={}", conversationId, request.getConversationId());
                return WebSocketMessageResponse.builder()
                        .conversationId(conversationId)
                        .status("error")
                        .errorMessage("Conversation ID mismatch")
                        .build();
            }

            // Lưu message vào database qua ChatService
            var messageRequest = new com.elearning.chat_service.dto.request.MessageRequest();
            messageRequest.setSenderId(request.getSenderId());
            messageRequest.setContent(request.getContent());

            var messageResponse = chatService.sendMessage(conversationId, messageRequest);

            // Trả về response kèm conversationId và delivery status
            return WebSocketMessageResponse.builder()
                    .id(messageResponse.getId())
                    .conversationId(conversationId)
                    .senderId(messageResponse.getSenderId())
                    .content(messageResponse.getContent())
                    .systemMessage(messageResponse.isSystemMessage())
                    .createdAt(messageResponse.getCreatedAt())
                    .status(messageResponse.getStatus().toString().toLowerCase())
                    .deliveredAt(messageResponse.getDeliveredAt())
                    .build();

        } catch (Exception e) {
            log.error("Error sending message for conversation: {}", conversationId, e);
            return WebSocketMessageResponse.builder()
                    .conversationId(conversationId)
                    .status("error")
                    .errorMessage("Internal server error: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Typing indicator - cho biết user đang gõ
     * Client gửi đến: /app/chat/conversations/{conversationId}/typing
     * Broadcast đến: /topic/conversations/{conversationId}/typing
     */
    @MessageMapping("/chat/conversations/{conversationId}/typing")
    @SendTo("/topic/conversations/{conversationId}/typing")
    public TypingIndicator handleTyping(
            @DestinationVariable String conversationId,
            TypingIndicator indicator) {

        // Validation
        if (indicator == null) {
            log.warn("Received null typing indicator for conversation: {}", conversationId);
            return new TypingIndicator(conversationId, null, null);
        }

        if (!StringUtils.hasText(indicator.getUserId())) {
            log.warn("Missing userId in typing indicator for conversation: {}", conversationId);
            return new TypingIndicator(conversationId, null, null);
        }

        log.debug("Typing indicator from user: {} in conversation: {}", indicator.getUserId(), conversationId);

        indicator.setConversationId(conversationId);
        return indicator;
    }

    /**
     * Heartbeat handler to keep presence alive
     * Client gửi heartbeat mỗi 2 phút
     */
    @MessageMapping("/heartbeat")
    public void handleHeartbeat(HeartbeatMessage message) {
        if (message != null && StringUtils.hasText(message.getUserId())) {
            presenceService.refreshPresence(message.getUserId());
            log.debug("Heartbeat received from user: {}", message.getUserId());
        }
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class TypingIndicator {
        private String conversationId;
        private String userId;
        private String userName;
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class HeartbeatMessage {
        private String userId;
        private String timestamp;
    }
}
