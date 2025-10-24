package com.elearning.chat_service.service.impl;

import com.elearning.chat_service.model.Conversation;
import com.elearning.chat_service.model.Message;
import com.elearning.chat_service.repository.ConversationRepository;
import com.elearning.chat_service.repository.MessageRepository;
import com.elearning.chat_service.service.EnrollmentEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentEventServiceImpl implements EnrollmentEventService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    @Override
    public void createConversationIfNotExists(String learnerId, String instructorId, String courseId) {
        

        // Create new conversation with fixed ID
        Conversation convo = Conversation.builder()
                .id("conv-123") // Set simple ID for testing
                .courseId(courseId)
                .learnerId(learnerId)
                .instructorId(instructorId)
                .participantIds(List.of(learnerId, instructorId))
                .createdAt(Instant.now())
                .build();
        conversationRepository.save(convo);

        // Create system message
        Message systemMsg = Message.builder()
                .conversationId(convo.getId())
                .senderId("system")
                .content("Bạn có thể bắt đầu trò chuyện với giảng viên về khóa học này.")
                .systemMessage(true)
                .createdAt(Instant.now())
                .build();
        messageRepository.save(systemMsg);
    }
}
