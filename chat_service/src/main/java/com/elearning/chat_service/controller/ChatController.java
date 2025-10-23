package com.elearning.chat_service.controller;

import com.elearning.chat_service.dto.request.*;
import com.elearning.chat_service.dto.response.*;
import com.elearning.chat_service.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @GetMapping("/conversations/{userId}")
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> getUserConversations(@PathVariable String userId) {
        List<ConversationResponse> conversations = chatService.getUserConversations(userId);
        return ResponseEntity.ok(ApiResponse.success(conversations, "Conversations retrieved successfully"));
    }

    @GetMapping("/messages/{conversationId}")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getMessages(@PathVariable String conversationId) {
        List<MessageResponse> messages = chatService.getMessages(conversationId);
        return ResponseEntity.ok(ApiResponse.success(messages, "Messages retrieved successfully"));
    }

    @PostMapping("/messages/{conversationId}")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @PathVariable String conversationId,
            @RequestBody MessageRequest req) {
        MessageResponse message = chatService.sendMessage(conversationId, req);
        return ResponseEntity.ok(ApiResponse.success(message, "Message sent successfully"));
    }

    @PostMapping("/messages/{messageId}/read")
    public ResponseEntity<ApiResponse<Void>> markMessageAsRead(
            @PathVariable String messageId,
            @RequestParam String userId) {
        chatService.markMessageAsRead(messageId, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Message marked as read"));
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<ApiResponse<Integer>> getUnreadCount(@PathVariable String userId) {
        int count = chatService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.success(count, "Unread count retrieved"));
    }

    @PostMapping("/unread/{userId}/reset")
    public ResponseEntity<ApiResponse<Void>> resetUnreadCount(@PathVariable String userId) {
        chatService.resetUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Unread count reset"));
    }
}
