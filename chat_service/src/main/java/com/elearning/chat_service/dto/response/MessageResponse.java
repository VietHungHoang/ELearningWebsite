package com.elearning.chat_service.dto.response;

import com.elearning.chat_service.dto.enums.MessageStatus;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;

@Data
@Builder
public class MessageResponse {
    private String id;
    private String senderId;
    private String content;
    private boolean systemMessage;
    private Instant createdAt;

    // Delivery status
    private MessageStatus status;
    private Instant deliveredAt;
    private Instant readAt;
    private String readBy;
}
