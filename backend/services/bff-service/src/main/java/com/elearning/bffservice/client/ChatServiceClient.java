package com.elearning.bffservice.client;

import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.RestResponsePage;
import com.elearning.bffservice.dto.response.ConversationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * Client for Chat Service
 */
@Component
@RequiredArgsConstructor
public class ChatServiceClient {

    private final RestTemplate restTemplate;

    @Value("${services.chat-service.url}")
    private String chatServiceBaseUrl;

    /**
     * Get user conversations
     */
    public ResponseEntity<ApiResponse<RestResponsePage<ConversationResponse>>> getUserConversations(String userId, int page, int size) {
        String url = chatServiceBaseUrl + "/api/conversations/user/" + userId + "?page=" + page + "&size=" + size;
        return restTemplate.exchange(url, HttpMethod.GET, null, new ParameterizedTypeReference<ApiResponse<RestResponsePage<ConversationResponse>>>() {});
    }
}