package com.elearning.chat_service.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessageResponse {
    private String id;
    private String conversationId;
    private String senderId;
    private String content;
    private boolean systemMessage;
    private Instant createdAt;
    private String status; // "sent", "delivered", "error"
    private Instant deliveredAt;
    private String errorMessage;
}
