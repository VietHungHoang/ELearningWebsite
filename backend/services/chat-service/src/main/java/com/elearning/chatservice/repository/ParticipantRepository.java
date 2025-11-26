package com.elearning.chatservice.repository;

import com.elearning.chatservice.entity.Participant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantRepository extends MongoRepository<Participant, String> {

    /**
     * Find participant by conversation and user
     */
    Optional<Participant> findByConversationIdAndUserId(String conversationId, String userId);

    /**
     * Find all participants in a conversation
     */
    List<Participant> findByConversationId(String conversationId);

    /**
     * Find all conversations for a user
     */
    List<Participant> findByUserId(String userId);

    /**
     * Find users currently typing in a conversation
     */
    @Query("{ 'conversationId': ?0, 'isTyping': true }")
    List<Participant> findTypingParticipants(String conversationId);

    /**
     * Delete all participants in a conversation
     */
    void deleteByConversationId(String conversationId);

    /**
     * Check if user is participant in conversation
     */
    boolean existsByConversationIdAndUserId(String conversationId, String userId);
}
