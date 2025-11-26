package com.elearning.chatservice.controller;

import com.elearning.chatservice.dto.request.CreateConversationRequest;
import com.elearning.chatservice.dto.response.ApiResponse;
import com.elearning.chatservice.dto.response.ConversationResponse;
import com.elearning.chatservice.entity.ConversationType;
import com.elearning.chatservice.service.ConversationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for conversation operations
 */
@Slf4j
@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @PostMapping
    public ResponseEntity<ApiResponse<ConversationResponse>> createConversation(
            @Valid @RequestBody CreateConversationRequest request,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Creating conversation: userId={}", userId);
        ConversationResponse response = conversationService.createConversation(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Conversation created successfully", response));
    }

    @GetMapping("/one-to-one/{otherUserId}")
    public ResponseEntity<ApiResponse<ConversationResponse>> getOrCreateOneToOne(
            @PathVariable String otherUserId,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Get or create one-to-one conversation: userId={}, otherUserId={}", userId, otherUserId);
        ConversationResponse response = conversationService.getOrCreateOneToOneConversation(userId, otherUserId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<ApiResponse<ConversationResponse>> getConversation(
            @PathVariable String conversationId,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Get conversation: conversationId={}, userId={}", conversationId, userId);
        ConversationResponse response = conversationService.getConversationById(conversationId, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ConversationResponse>>> getUserConversations(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false) ConversationType type,
            Pageable pageable) {
        
        log.info("Get user conversations: userId={}, type={}", userId, type);
        Page<ConversationResponse> response;
        
        if (type != null) {
            response = conversationService.getUserConversationsByType(userId, type, pageable);
        } else {
            response = conversationService.getUserConversations(userId, pageable);
        }
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{conversationId}/participants")
    public ResponseEntity<ApiResponse<ConversationResponse>> addParticipants(
            @PathVariable String conversationId,
            @RequestBody List<String> participantIds,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Add participants: conversationId={}, count={}", conversationId, participantIds.size());
        ConversationResponse response = conversationService.addParticipants(conversationId, participantIds, userId);
        return ResponseEntity.ok(ApiResponse.success("Participants added successfully", response));
    }

    @DeleteMapping("/{conversationId}/participants/{participantId}")
    public ResponseEntity<ApiResponse<ConversationResponse>> removeParticipant(
            @PathVariable String conversationId,
            @PathVariable String participantId,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Remove participant: conversationId={}, participantId={}", conversationId, participantId);
        ConversationResponse response = conversationService.removeParticipant(conversationId, participantId, userId);
        return ResponseEntity.ok(ApiResponse.success("Participant removed successfully", response));
    }

    @PutMapping("/{conversationId}")
    public ResponseEntity<ApiResponse<ConversationResponse>> updateConversation(
            @PathVariable String conversationId,
            @RequestParam String name,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Update conversation: conversationId={}, name={}", conversationId, name);
        ConversationResponse response = conversationService.updateConversation(conversationId, name, userId);
        return ResponseEntity.ok(ApiResponse.success("Conversation updated successfully", response));
    }

    @DeleteMapping("/{conversationId}")
    public ResponseEntity<ApiResponse<Void>> deleteConversation(
            @PathVariable String conversationId,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("Delete conversation: conversationId={}", conversationId);
        conversationService.deleteConversation(conversationId, userId);
        return ResponseEntity.ok(ApiResponse.success("Conversation deleted successfully", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ConversationResponse>>> searchConversations(
            @RequestParam String query,
            @RequestHeader("X-User-Id") String userId,
            Pageable pageable) {
        
        log.info("Search conversations: userId={}, query={}", userId, query);
        Page<ConversationResponse> response = conversationService.searchConversations(userId, query, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
