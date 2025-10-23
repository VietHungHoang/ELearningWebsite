package com.elearning.chat_service.model;

import com.elearning.chat_service.dto.enums.MessageStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "messages")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @Id
    private String id;
    private String conversationId;
    private String senderId;
    private String content;
    private boolean systemMessage;
    private Instant createdAt;

    // Delivery status tracking
    private MessageStatus status; // SENT, DELIVERED, READ
    private Instant deliveredAt;
    private Instant readAt;
    private String readBy; // userId đã đọc
}
