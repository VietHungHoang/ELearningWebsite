package com.elearning.chat_service.service;

import com.elearning.chat_service.dto.request.*;
import com.elearning.chat_service.dto.response.*;

import java.util.List;

public interface ChatService {

    List<ConversationResponse> getUserConversations(String userId);

    List<MessageResponse> getMessages(String conversationId);

    MessageResponse sendMessage(String conversationId, MessageRequest req);

    void markMessageAsRead(String messageId, String userId);

    // Unread count management
    int getUnreadCount(String userId);

    void resetUnreadCount(String userId);
}