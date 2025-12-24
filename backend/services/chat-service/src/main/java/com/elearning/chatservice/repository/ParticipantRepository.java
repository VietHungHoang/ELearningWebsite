package com.elearning.chatservice.repository;

import com.elearning.chatservice.entity.Participant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParticipantRepository extends MongoRepository<Participant, UUID> {

    /**
     * Find participant by conversation and user
     */
    Optional<Participant> findByConversationIdAndUserId(UUID conversationId, UUID userId);

    /**
     * Find all participants in a conversation
     */
    List<Participant> findByConversationId(UUID conversationId);

    /**
     * Find all conversations for a user
     */
    List<Participant> findByUserId(UUID userId);

    /**
     * Find users currently typing in a conversation
     */
    @Query("{ 'conversationId': ?0, 'isTyping': true }")
    List<Participant> findTypingParticipants(UUID conversationId);

    /**
     * Delete all participants in a conversation
     */
    void deleteByConversationId(UUID conversationId);

    /**
     * Check if user is participant in conversation
     */
    boolean existsByConversationIdAndUserId(UUID conversationId, UUID userId);
}
