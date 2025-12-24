package com.elearning.chatservice.service.impl;

import com.elearning.chatservice.dto.response.ParticipantResponse;
import com.elearning.chatservice.entity.Participant;
import com.elearning.chatservice.repository.ParticipantRepository;
import com.elearning.chatservice.service.ParticipantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ParticipantServiceImpl implements ParticipantService {

    private final ParticipantRepository participantRepository;

    @Override
    @Transactional
    public void updateTypingStatus(UUID conversationId, UUID userId, boolean isTyping) {
        Participant participant = participantRepository.findByConversationIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        participant.setTyping(isTyping);
        participant.setLastTypingAt(LocalDateTime.now());
        participantRepository.save(participant);

        log.debug("Typing status updated: conversationId={}, userId={}, isTyping={}", 
                conversationId, userId, isTyping);
    }

    @Override
    public List<ParticipantResponse> getTypingParticipants(UUID conversationId) {
        return participantRepository.findTypingParticipants(conversationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateLastSeen(UUID conversationId, UUID userId) {
        participantRepository.findByConversationIdAndUserId(conversationId, userId)
                .ifPresent(participant -> {
                    participant.setLastSeenAt(LocalDateTime.now());
                    participantRepository.save(participant);
                });
    }

    @Override
    public ParticipantResponse getParticipant(UUID conversationId, UUID userId) {
        Participant participant = participantRepository.findByConversationIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));
        return mapToResponse(participant);
    }

    @Override
    public List<ParticipantResponse> getConversationParticipants(UUID conversationId) {
        return participantRepository.findByConversationId(conversationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isParticipant(UUID conversationId, UUID userId) {
        return participantRepository.existsByConversationIdAndUserId(conversationId, userId);
    }

    private ParticipantResponse mapToResponse(Participant participant) {
        return ParticipantResponse.builder()
                .id(participant.getId())
                .conversationId(participant.getConversationId())
                .userId(participant.getUserId())
                .isTyping(participant.isTyping())
                .lastSeenAt(participant.getLastSeenAt())
                .joinedAt(participant.getJoinedAt())
                .isMuted(participant.isMuted())
                .isAdmin(participant.isAdmin())
                .build();
    }
}
