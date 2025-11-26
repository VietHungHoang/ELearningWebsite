package com.elearning.chatservice.service.impl;

import com.elearning.chatservice.dto.request.CreateConversationRequest;
import com.elearning.chatservice.dto.response.ConversationResponse;
import com.elearning.chatservice.dto.response.MessageResponse;
import com.elearning.chatservice.dto.response.ParticipantResponse;
import com.elearning.chatservice.entity.Conversation;
import com.elearning.chatservice.entity.ConversationType;
import com.elearning.chatservice.entity.Message;
import com.elearning.chatservice.entity.Participant;
import com.elearning.chatservice.repository.ConversationRepository;
import com.elearning.chatservice.repository.MessageRepository;
import com.elearning.chatservice.repository.ParticipantRepository;
import com.elearning.chatservice.service.ConversationService;
import com.elearning.chatservice.service.MessageService;
import com.elearning.chatservice.service.ParticipantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {

    private final ConversationRepository conversationRepository;
    private final ParticipantRepository participantRepository;
    private final MessageRepository messageRepository;
    private final ParticipantService participantService;

    @Override
    @Transactional
    public ConversationResponse createConversation(CreateConversationRequest request, String createdBy) {
        log.info("Creating conversation: type={}, createdBy={}", request.getType(), createdBy);

        // Validate participants
        List<String> participantIds = new ArrayList<>(request.getParticipantIds());
        if (!participantIds.contains(createdBy)) {
            participantIds.add(createdBy);
        }

        // For one-to-one, check if conversation already exists
        if (request.getType() == ConversationType.ONE_TO_ONE) {
            if (participantIds.size() != 2) {
                throw new IllegalArgumentException("One-to-one conversation must have exactly 2 participants");
            }
            
            var existing = conversationRepository.findOneToOneConversation(participantIds);
            if (existing.isPresent()) {
                return mapToResponse(existing.get());
            }
        }

        // Create conversation
        Conversation conversation = Conversation.builder()
                .name(request.getName())
                .type(request.getType())
                .participantIds(participantIds)
                .classId(request.getClassId())
                .createdBy(createdBy)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .isActive(true)
                .build();

        conversation = conversationRepository.save(conversation);

        // Create participant records
        for (String participantId : participantIds) {
            Participant participant = new Participant(conversation.getId(), participantId);
            participant.setAdmin(participantId.equals(createdBy));
            participantRepository.save(participant);
        }

        log.info("Conversation created: id={}", conversation.getId());
        return mapToResponse(conversation);
    }

    @Override
    public ConversationResponse getOrCreateOneToOneConversation(String userId1, String userId2) {
        List<String> participantIds = Arrays.asList(userId1, userId2);
        
        var existing = conversationRepository.findOneToOneConversation(participantIds);
        if (existing.isPresent()) {
            return mapToResponse(existing.get());
        }

        // Create new conversation
        CreateConversationRequest request = CreateConversationRequest.builder()
                .type(ConversationType.ONE_TO_ONE)
                .participantIds(participantIds)
                .build();

        return createConversation(request, userId1);
    }

    @Override
    public ConversationResponse getConversationById(String conversationId, String userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        if (!conversation.getParticipantIds().contains(userId)) {
            throw new RuntimeException("User is not a participant in this conversation");
        }

        return mapToResponse(conversation);
    }

    @Override
    public Page<ConversationResponse> getUserConversations(String userId, Pageable pageable) {
        return conversationRepository.findByParticipantId(userId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<ConversationResponse> getUserConversationsByType(String userId, ConversationType type, Pageable pageable) {
        return conversationRepository.findByParticipantIdAndType(userId, type, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public ConversationResponse addParticipants(String conversationId, List<String> participantIds, String requestUserId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        if (conversation.getType() == ConversationType.ONE_TO_ONE) {
            throw new IllegalArgumentException("Cannot add participants to one-to-one conversation");
        }

        // Check if requester is admin
        Participant requester = participantRepository.findByConversationIdAndUserId(conversationId, requestUserId)
                .orElseThrow(() -> new RuntimeException("User is not a participant"));

        if (!requester.isAdmin()) {
            throw new RuntimeException("Only admins can add participants");
        }

        // Add new participants
        for (String participantId : participantIds) {
            if (!conversation.getParticipantIds().contains(participantId)) {
                conversation.getParticipantIds().add(participantId);
                Participant participant = new Participant(conversationId, participantId);
                participantRepository.save(participant);
            }
        }

        conversation.setUpdatedAt(LocalDateTime.now());
        conversation = conversationRepository.save(conversation);

        return mapToResponse(conversation);
    }

    @Override
    @Transactional
    public ConversationResponse removeParticipant(String conversationId, String participantId, String requestUserId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        if (conversation.getType() == ConversationType.ONE_TO_ONE) {
            throw new IllegalArgumentException("Cannot remove participants from one-to-one conversation");
        }

        // Users can remove themselves, or admins can remove others
        Participant requester = participantRepository.findByConversationIdAndUserId(conversationId, requestUserId)
                .orElseThrow(() -> new RuntimeException("User is not a participant"));

        if (!requestUserId.equals(participantId) && !requester.isAdmin()) {
            throw new RuntimeException("Only admins can remove other participants");
        }

        conversation.getParticipantIds().remove(participantId);
        participantRepository.findByConversationIdAndUserId(conversationId, participantId)
                .ifPresent(participantRepository::delete);

        conversation.setUpdatedAt(LocalDateTime.now());
        conversation = conversationRepository.save(conversation);

        return mapToResponse(conversation);
    }

    @Override
    @Transactional
    public ConversationResponse updateConversation(String conversationId, String name, String userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        if (!conversation.getParticipantIds().contains(userId)) {
            throw new RuntimeException("User is not a participant");
        }

        conversation.setName(name);
        conversation.setUpdatedAt(LocalDateTime.now());
        conversation = conversationRepository.save(conversation);

        return mapToResponse(conversation);
    }

    @Override
    @Transactional
    public void deleteConversation(String conversationId, String userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        if (!conversation.getCreatedBy().equals(userId)) {
            throw new RuntimeException("Only the creator can delete this conversation");
        }

        conversation.setActive(false);
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);
    }

    @Override
    public Page<ConversationResponse> searchConversations(String userId, String searchText, Pageable pageable) {
        return conversationRepository.searchByNameForUser(userId, searchText, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public void updateLastMessage(String conversationId, String messageId) {
        conversationRepository.findById(conversationId).ifPresent(conversation -> {
            conversation.setLastMessageId(messageId);
            conversation.setLastMessageAt(LocalDateTime.now());
            conversationRepository.save(conversation);
        });
    }

    private ConversationResponse mapToResponse(Conversation conversation) {
        ConversationResponse response = ConversationResponse.builder()
                .id(conversation.getId())
                .name(conversation.getName())
                .type(conversation.getType())
                .participantIds(conversation.getParticipantIds())
                .classId(conversation.getClassId())
                .createdBy(conversation.getCreatedBy())
                .createdAt(conversation.getCreatedAt())
                .updatedAt(conversation.getUpdatedAt())
                .lastMessageAt(conversation.getLastMessageAt())
                .build();

        // Get typing users
        List<ParticipantResponse> typingUsers = participantService.getTypingParticipants(conversation.getId());
        response.setTypingUsers(typingUsers);

        return response;
    }
}
