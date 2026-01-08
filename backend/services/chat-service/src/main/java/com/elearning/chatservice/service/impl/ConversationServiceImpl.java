package com.elearning.chatservice.service.impl;

import com.elearning.chatservice.dto.request.CreateConversationRequest;
import com.elearning.chatservice.dto.response.ConversationResponse;
import com.elearning.chatservice.dto.response.ParticipantResponse;
import com.elearning.chatservice.dto.response.ParticipantUserInfo;
import com.elearning.chatservice.entity.Conversation;
import com.elearning.chatservice.entity.ConversationType;
import com.elearning.chatservice.entity.Message;
import com.elearning.chatservice.entity.Participant;
import com.elearning.chatservice.entity.UserCache;
import com.elearning.chatservice.repository.ConversationRepository;
import com.elearning.chatservice.repository.MessageRepository;
import com.elearning.chatservice.repository.ParticipantRepository;
import com.elearning.chatservice.service.ConversationService;
import com.elearning.chatservice.service.ParticipantService;
import com.elearning.chatservice.service.UserCacheService;
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
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {

    private final ConversationRepository conversationRepository;
    private final ParticipantRepository participantRepository;
    private final MessageRepository messageRepository;
    private final ParticipantService participantService;
    private final UserCacheService userCacheService;

    @Override
    @Transactional
    public ConversationResponse createConversation(CreateConversationRequest request, UUID createdBy) {
        log.info("Creating conversation: type={}, createdBy={}", request.getType(), createdBy);

        // Validate participants first
        List<UUID> participantIds = new ArrayList<>(request.getParticipantIds());
        if (!participantIds.contains(createdBy)) {
            participantIds.add(createdBy);
        }

        // IMPORTANT: Save user info to cache BEFORE checking if conversation exists

        if (request.getParticipantInfos() != null && !request.getParticipantInfos().isEmpty()) {
            userCacheService.saveOrUpdateUsers(request.getParticipantInfos());
            log.debug("Updated user cache for {} participants", request.getParticipantInfos().size());
        }
        // For one-to-one, check if conversation already exists
        // For one-to-one, check if conversation already exists
        if (request.getType() == ConversationType.ONE_TO_ONE) {
            if (participantIds.size() != 2) {
                throw new IllegalArgumentException("One-to-one conversation must have exactly 2 participants");
            }

            var existing = conversationRepository.findOneToOneConversation(participantIds);
            if (existing.isPresent()) {
                // User cache has been updated above, so mapToResponse will use the new data
                return mapToResponse(existing.get(), null);
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
        for (UUID participantId : participantIds) {
            Participant participant = new Participant(conversation.getId(), participantId);
            participant.setAdmin(participantId.equals(createdBy));
            participantRepository.save(participant);
        }

        log.info("Conversation created: id={}", conversation.getId());
        return mapToResponse(conversation, null);
    }

    @Override
    public ConversationResponse getOrCreateOneToOneConversation(UUID userId1, UUID userId2) {
        List<UUID> participantIds = Arrays.asList(userId1, userId2);

        var existing = conversationRepository.findOneToOneConversation(participantIds);
        if (existing.isPresent()) {
            return mapToResponse(existing.get(), null);
        }

        // Create new conversation
        CreateConversationRequest request = CreateConversationRequest.builder()
                .type(ConversationType.ONE_TO_ONE)
                .participantIds(participantIds)
                .build();

        return createConversation(request, userId1);
    }

    @Override
    public ConversationResponse getConversationById(UUID conversationId, UUID userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        if (!conversation.getParticipantIds().contains(userId)) {
            throw new RuntimeException("User is not a participant in this conversation");
        }

        return mapToResponse(conversation, userId);
    }

    @Override
    public Page<ConversationResponse> getUserConversations(UUID userId, Pageable pageable) {
        return conversationRepository.findByParticipantId(userId, pageable)
                .map(conversation -> mapToResponse(conversation, userId));
    }

    @Override
    public Page<ConversationResponse> getUserConversationsByType(UUID userId, ConversationType type,
            Pageable pageable) {
        return conversationRepository.findByParticipantIdAndType(userId, type, pageable)
                .map(conversation -> mapToResponse(conversation, userId));
    }

    @Override
    @Transactional
    public ConversationResponse addParticipants(UUID conversationId, List<UUID> participantIds, UUID requestUserId) {
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
        for (UUID participantId : participantIds) {
            if (!conversation.getParticipantIds().contains(participantId)) {
                conversation.getParticipantIds().add(participantId);
                Participant participant = new Participant(conversationId, participantId);
                participantRepository.save(participant);
            }
        }

        conversation.setUpdatedAt(LocalDateTime.now());
        conversation = conversationRepository.save(conversation);

        return mapToResponse(conversation, null);
    }

    @Override
    @Transactional
    public ConversationResponse removeParticipant(UUID conversationId, UUID participantId, UUID requestUserId) {
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

        return mapToResponse(conversation, null);
    }

    @Override
    @Transactional
    public ConversationResponse updateConversation(UUID conversationId, String name, UUID userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        if (!conversation.getParticipantIds().contains(userId)) {
            throw new RuntimeException("User is not a participant");
        }

        conversation.setName(name);
        conversation.setUpdatedAt(LocalDateTime.now());
        conversation = conversationRepository.save(conversation);

        return mapToResponse(conversation, null);
    }

    @Override
    @Transactional
    public void deleteConversation(UUID conversationId, UUID userId) {
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
    public Page<ConversationResponse> searchConversations(UUID userId, String searchText, Pageable pageable) {
        return conversationRepository.searchByNameForUser(userId, searchText, pageable)
                .map(conversation -> mapToResponse(conversation, userId));
    }

    @Override
    @Transactional
    public void updateLastMessage(UUID conversationId, UUID messageId) {
        conversationRepository.findById(conversationId).ifPresent(conversation -> {
            conversation.setLastMessageId(messageId);
            conversation.setLastMessageAt(LocalDateTime.now());
            conversationRepository.save(conversation);
        });
    }

    private ConversationResponse mapToResponse(Conversation conversation, UUID userId) {
        // Get participant details from cache
        Map<UUID, UserCache> userCacheMap = userCacheService.getUsersByIds(conversation.getParticipantIds());
        List<ParticipantUserInfo> participantDetails = conversation.getParticipantIds().stream()
                .map(id -> {
                    UserCache cached = userCacheMap.get(id);
                    return ParticipantUserInfo.builder()
                            .userId(id)
                            .fullName(cached != null ? cached.getFullName() : "Unknown")
                            .avatarUrl(cached != null ? cached.getAvatarUrl() : null)
                            .build();
                })
                .toList();

        ConversationResponse.ConversationResponseBuilder builder = ConversationResponse.builder()
                .id(conversation.getId())
                .name(conversation.getName())
                .type(conversation.getType())
                .participantIds(conversation.getParticipantIds())
                .participantDetails(participantDetails)
                .classId(conversation.getClassId())
                .createdBy(conversation.getCreatedBy())
                .createdAt(conversation.getCreatedAt())
                .updatedAt(conversation.getUpdatedAt())
                .lastMessageAt(conversation.getLastMessageAt());

        // Populate lastMessage if exists
        if (conversation.getLastMessageId() != null) {
            try {
                Message lastMessage = messageRepository.findById(conversation.getLastMessageId()).orElse(null);
                if (lastMessage != null) {
                    // TODO: Implement messageService.mapToResponse
                    // builder.lastMessage(messageService.mapToResponse(lastMessage));
                }
            } catch (Exception e) {
                log.warn("Failed to load last message for conversation {}", conversation.getId(), e);
            }
        }

        ConversationResponse response = builder.build();

        // Populate unreadCount if userId is provided
        if (userId != null) {
            try {
                long unreadCount = messageRepository.countUnreadMessages(conversation.getId(), userId);
                response.setUnreadCount(unreadCount);
            } catch (Exception e) {
                log.warn("Failed to count unread messages for conversation {} and user {}", conversation.getId(),
                        userId, e);
            }
        }

        // Get typing users
        List<ParticipantResponse> typingUsers = participantService.getTypingParticipants(conversation.getId());
        response.setTypingUsers(typingUsers);

        return response;
    }
}
