package com.elearning.chat_service.dto.request;
import lombok.Data;
@Data
public class MessageRequest {
    private String senderId;
    private String content;
}