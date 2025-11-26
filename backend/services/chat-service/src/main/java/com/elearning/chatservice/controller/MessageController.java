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

/**
 * REST Controller for message operations
 */
@Slf4j
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @Valid @RequestBody SendMessageRequest request,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Send message: userId={}, conversationId={}", userId, request.getConversationId());
        MessageResponse response = messageService.sendMessage(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Message sent successfully", response));
    }

    @PostMapping("/with-files")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessageWithFiles(
            @RequestPart("message") @Valid SendMessageRequest request,
            @RequestPart("files") List<MultipartFile> files,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Send message with files: userId={}, conversationId={}, fileCount={}", 
                userId, request.getConversationId(), files.size());
        MessageResponse response = messageService.sendMessageWithFiles(request, files, userId);
        return ResponseEntity.ok(ApiResponse.success("Message sent successfully", response));
    }

    @GetMapping("/{messageId}")
    public ResponseEntity<ApiResponse<MessageResponse>> getMessage(
            @PathVariable String messageId,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Get message: messageId={}, userId={}", messageId, userId);
        MessageResponse response = messageService.getMessageById(messageId, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<ApiResponse<Page<MessageResponse>>> getConversationMessages(
            @PathVariable String conversationId,
            @RequestHeader("X-User-Id") String userId,
            Pageable pageable) {
        
        log.info("Get conversation messages: conversationId={}, userId={}", conversationId, userId);
        Page<MessageResponse> response = messageService.getConversationMessages(conversationId, userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<MessageResponse>> editMessage(
            @Valid @RequestBody EditMessageRequest request,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Edit message: messageId={}, userId={}", request.getMessageId(), userId);
        MessageResponse response = messageService.editMessage(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Message edited successfully", response));
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(
            @PathVariable String messageId,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Delete message: messageId={}, userId={}", messageId, userId);
        messageService.deleteMessage(messageId, userId);
        return ResponseEntity.ok(ApiResponse.success("Message deleted successfully", null));
    }

    @PostMapping("/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @Valid @RequestBody MarkAsReadRequest request,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Mark as read: conversationId={}, messageId={}, userId={}", 
                request.getConversationId(), request.getMessageId(), userId);
        
        if (request.getMessageId() != null) {
            messageService.markAsRead(request.getConversationId(), request.getMessageId(), userId);
        } else {
            messageService.markAllAsRead(request.getConversationId(), userId);
        }
        
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }

    @PostMapping("/{messageId}/reactions")
    public ResponseEntity<ApiResponse<MessageResponse>> addReaction(
            @PathVariable String messageId,
            @Valid @RequestBody AddReactionRequest request,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Add reaction: messageId={}, emoji={}, userId={}", messageId, request.getEmoji(), userId);
        MessageResponse response = messageService.addReaction(messageId, request.getEmoji(), userId);
        return ResponseEntity.ok(ApiResponse.success("Reaction added", response));
    }

    @DeleteMapping("/{messageId}/reactions")
    public ResponseEntity<ApiResponse<MessageResponse>> removeReaction(
            @PathVariable String messageId,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Remove reaction: messageId={}, userId={}", messageId, userId);
        MessageResponse response = messageService.removeReaction(messageId, userId);
        return ResponseEntity.ok(ApiResponse.success("Reaction removed", response));
    }

    @GetMapping("/conversation/{conversationId}/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @PathVariable String conversationId,
            @RequestHeader("X-User-Id") String userId) {
        
        long count = messageService.getUnreadCount(conversationId, userId);
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @GetMapping("/conversation/{conversationId}/search")
    public ResponseEntity<ApiResponse<Page<MessageResponse>>> searchMessages(
            @PathVariable String conversationId,
            @RequestParam String query,
            @RequestHeader("X-User-Id") String userId,
            Pageable pageable) {
        
        log.info("Search messages: conversationId={}, query={}", conversationId, query);
        Page<MessageResponse> response = messageService.searchMessages(conversationId, query, userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/conversation/{conversationId}/type/{type}")
    public ResponseEntity<ApiResponse<Page<MessageResponse>>> getMessagesByType(
            @PathVariable String conversationId,
            @PathVariable MessageType type,
            @RequestHeader("X-User-Id") String userId,
            Pageable pageable) {
        
        log.info("Get messages by type: conversationId={}, type={}", conversationId, type);
        Page<MessageResponse> response = messageService.getMessagesByType(conversationId, type, userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
