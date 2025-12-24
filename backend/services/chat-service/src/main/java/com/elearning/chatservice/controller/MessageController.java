package com.elearning.chatservice.controller;

import com.elearning.chatservice.dto.request.AddReactionRequest;
import com.elearning.chatservice.dto.request.EditMessageRequest;
import com.elearning.chatservice.dto.request.MarkAsReadRequest;
import com.elearning.chatservice.dto.request.SendMessageRequest;
import com.elearning.chatservice.dto.response.ApiResponse;
import com.elearning.chatservice.dto.response.MessageResponse;
import com.elearning.chatservice.entity.MessageType;
import com.elearning.chatservice.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/chat/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @Valid @RequestBody SendMessageRequest request,
            @RequestHeader("X-User-Id") UUID userId) {
        
        log.info("Send message: userId={}, conversationId={}", userId, request.getConversationId());
        MessageResponse response = messageService.sendMessage(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Message sent successfully", response));
    }

    @PostMapping("/with-files")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessageWithFiles(
            @RequestPart("message") @Valid SendMessageRequest request,
            @RequestPart("files") List<MultipartFile> files,
            @RequestHeader("X-User-Id") UUID userId) {
        
        log.info("Send message with files: userId={}, conversationId={}, fileCount={}", 
                userId, request.getConversationId(), files.size());
        MessageResponse response = messageService.sendMessageWithFiles(request, files, userId);
        return ResponseEntity.ok(ApiResponse.success("Message sent successfully", response));
    }

    @GetMapping("/{messageId}")
    public ResponseEntity<ApiResponse<MessageResponse>> getMessage(
            @PathVariable UUID messageId,
            @RequestHeader("X-User-Id") UUID userId) {
        
        log.info("Get message: messageId={}, userId={}", messageId, userId);
        MessageResponse response = messageService.getMessageById(messageId, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<ApiResponse<Page<MessageResponse>>> getConversationMessages(
            @PathVariable UUID conversationId,
            @RequestHeader("X-User-Id") UUID userId,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "50") int limit,
            Pageable pageable) {
        
        log.info("Get conversation messages: conversationId={}, userId={}, offset={}, limit={}", 
                conversationId, userId, offset, limit);
        
        // Validate user is participant
        if (!messageService.isUserParticipant(conversationId, userId)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied: User is not a participant"));
        }
        
        Page<MessageResponse> response = messageService.getConversationMessages(conversationId, userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<MessageResponse>> editMessage(
            @Valid @RequestBody EditMessageRequest request,
            @RequestHeader("X-User-Id") UUID userId) {
        
        log.info("Edit message: messageId={}, userId={}", request.getMessageId(), userId);
        MessageResponse response = messageService.editMessage(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Message edited successfully", response));
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(
            @PathVariable UUID messageId,
            @RequestHeader("X-User-Id") UUID userId) {
        
        log.info("Delete message: messageId={}, userId={}", messageId, userId);
        messageService.deleteMessage(messageId, userId);
        return ResponseEntity.ok(ApiResponse.success("Message deleted successfully", null));
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<ApiResponse<Void>> markMessageAsRead(
            @PathVariable UUID messageId,
            @RequestHeader("X-User-Id") UUID userId) {
        
        log.info("Mark message as read: messageId={}, userId={}", messageId, userId);
        
        // Get conversationId from message and validate user is participant
        UUID conversationId = messageService.getConversationIdByMessageId(messageId);
        if (conversationId == null) {
            return ResponseEntity.status(404).body(ApiResponse.error("Message not found"));
        }
        
        if (!messageService.isUserParticipant(conversationId, userId)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied: User is not a participant"));
        }
        
        messageService.markAsRead(conversationId, messageId, userId);
        return ResponseEntity.ok(ApiResponse.success("Message marked as read", null));
    }

    @PostMapping("/{messageId}/reactions")
    public ResponseEntity<ApiResponse<MessageResponse>> addReaction(
            @PathVariable UUID messageId,
            @Valid @RequestBody AddReactionRequest request,
            @RequestHeader("X-User-Id") UUID userId) {
        
        log.info("Add reaction: messageId={}, emoji={}, userId={}", messageId, request.getEmoji(), userId);
        MessageResponse response = messageService.addReaction(messageId, request.getEmoji(), userId);
        return ResponseEntity.ok(ApiResponse.success("Reaction added", response));
    }

    @DeleteMapping("/{messageId}/reactions")
    public ResponseEntity<ApiResponse<MessageResponse>> removeReaction(
            @PathVariable UUID messageId,
            @RequestHeader("X-User-Id") UUID userId) {
        
        log.info("Remove reaction: messageId={}, userId={}", messageId, userId);
        MessageResponse response = messageService.removeReaction(messageId, userId);
        return ResponseEntity.ok(ApiResponse.success("Reaction removed", response));
    }

    @GetMapping("/conversation/{conversationId}/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @PathVariable UUID conversationId,
            @RequestHeader("X-User-Id") UUID userId) {
        
        long count = messageService.getUnreadCount(conversationId, userId);
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @GetMapping("/conversation/{conversationId}/search")
    public ResponseEntity<ApiResponse<Page<MessageResponse>>> searchMessages(
            @PathVariable UUID conversationId,
            @RequestParam String query,
            @RequestHeader("X-User-Id") UUID userId,
            Pageable pageable) {
        
        log.info("Search messages: conversationId={}, query={}", conversationId, query);
        Page<MessageResponse> response = messageService.searchMessages(conversationId, query, userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/conversation/{conversationId}/type/{type}")
    public ResponseEntity<ApiResponse<Page<MessageResponse>>> getMessagesByType(
            @PathVariable UUID conversationId,
            @PathVariable MessageType type,
            @RequestHeader("X-User-Id") UUID userId,
            Pageable pageable) {
        
        log.info("Get messages by type: conversationId={}, type={}", conversationId, type);
        Page<MessageResponse> response = messageService.getMessagesByType(conversationId, type, userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
