package com.elearning.chatservice.repository;

import com.elearning.chatservice.entity.Conversation;
import com.elearning.chatservice.entity.ConversationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {

    /**
     * Find all conversations for a user
     */
    @Query("{ 'participantIds': ?0, 'isActive': true }")
    Page<Conversation> findByParticipantId(String userId, Pageable pageable);

    /**
     * Find one-to-one conversation between two users
     */
    @Query("{ 'type': 'ONE_TO_ONE', 'participantIds': { $all: ?0 }, 'isActive': true }")
    Optional<Conversation> findOneToOneConversation(List<String> participantIds);

    /**
     * Find conversations by class ID
     */
    Page<Conversation> findByClassIdAndIsActiveTrue(String classId, Pageable pageable);

    /**
     * Find conversations by type for a user
     */
    @Query("{ 'participantIds': ?0, 'type': ?1, 'isActive': true }")
    Page<Conversation> findByParticipantIdAndType(String userId, ConversationType type, Pageable pageable);

    /**
     * Search conversations by name
     */
    @Query("{ 'participantIds': ?0, 'name': { $regex: ?1, $options: 'i' }, 'isActive': true }")
    Page<Conversation> searchByNameForUser(String userId, String namePattern, Pageable pageable);
}
