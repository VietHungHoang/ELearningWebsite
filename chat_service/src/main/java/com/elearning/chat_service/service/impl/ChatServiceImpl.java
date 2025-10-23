package com.elearning.chat_service.service.impl;

import com.elearning.chat_service.dto.enums.MessageStatus;
import com.elearning.chat_service.dto.request.*;
import com.elearning.chat_service.dto.response.*;
import com.elearning.chat_service.model.*;
import com.elearning.chat_service.repository.*;
import com.elearning.chat_service.service.ChatService;
import com.elearning.chat_service.service.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final PresenceService presenceService;

    @Override
    public List<ConversationResponse> getUserConversations(String userId) {
        return conversationRepository.findByParticipantIdsContains(userId)
                .stream()
                .map(c -> ConversationResponse.builder()
                        .id(c.getId())
                        .courseId(c.getCourseId())
                        .learnerId(c.getLearnerId())
                        .instructorId(c.getInstructorId())
                        .participantIds(c.getParticipantIds())
                        .createdAt(c.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageResponse> getMessages(String conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MessageResponse sendMessage(String conversationId, MessageRequest req) {
        // Get recipient info from conversation
        Conversation conversation = conversationRepository.findById(conversationId).orElse(null);
        String recipientId = null;

        if (conversation != null) {
            // Get the other participant (not the sender)
            recipientId = conversation.getParticipantIds().stream()
                    .filter(p -> !p.equals(req.getSenderId()))
                    .findFirst()
                    .orElse(null);
        }

        // Determine message status based on recipient online status
        MessageStatus status = MessageStatus.SENT;
        Instant deliveredAt = null;

        if (recipientId != null && presenceService.isUserOnline(recipientId)) {
            status = MessageStatus.DELIVERED;
            deliveredAt = Instant.now();
        } else if (recipientId != null) {
            // Recipient offline - increment unread count for badge display
            presenceService.incrementUnreadCount(recipientId);
        }
        Message msg = Message.builder()
                .conversationId(conversationId)
                .senderId(req.getSenderId())
                .content(req.getContent())
                .systemMessage(false)
                .status(status)
                .deliveredAt(deliveredAt)
                .createdAt(Instant.now())
                .build();

        messageRepository.save(msg);

        return convertToResponse(msg);
    }

    public void markMessageAsRead(String messageId, String userId) {
        Message msg = messageRepository.findById(messageId).orElse(null);
        if (msg != null) {
            msg.setStatus(MessageStatus.READ);
            msg.setReadAt(Instant.now());
            msg.setReadBy(userId);
            messageRepository.save(msg);
        }
    }

    private MessageResponse convertToResponse(Message msg) {
        return MessageResponse.builder()
                .id(msg.getId())
                .senderId(msg.getSenderId())
                .content(msg.getContent())
                .systemMessage(msg.isSystemMessage())
                .status(msg.getStatus())
                .deliveredAt(msg.getDeliveredAt())
                .readAt(msg.getReadAt())
                .readBy(msg.getReadBy())
                .createdAt(msg.getCreatedAt())
                .build();
    }

    @Override
    public int getUnreadCount(String userId) {
        return presenceService.getUnreadCount(userId);
    }

    @Override
    public void resetUnreadCount(String userId) {
        presenceService.resetUnreadCount(userId);
    }
}
