package com.elearning.bffservice.controller;

import com.elearning.bffservice.client.ChatServiceClient;
import com.elearning.bffservice.dto.RestResponsePage;
import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.response.ConversationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/bff/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatServiceClient chatServiceClient;

    @GetMapping("/conversations/{userId}")
    public ResponseEntity<ApiResponse<RestResponsePage<ConversationResponse>>> getUserConversations(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        ResponseEntity<ApiResponse<RestResponsePage<ConversationResponse>>> response = chatServiceClient.getUserConversations(userId, page, size);
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }
}