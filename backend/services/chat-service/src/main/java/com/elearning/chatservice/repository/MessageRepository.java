package com.elearning.chatservice.repository;

import com.elearning.chatservice.entity.Message;
import com.elearning.chatservice.entity.MessageType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends MongoRepository<Message, UUID> {

    /**
     * Find messages in a conversation with pagination
     */
    Page<Message> findByConversationIdAndIsDeletedFalseOrderByCreatedAtDesc(
            UUID conversationId, Pageable pageable);

    /**
     * Find messages after a specific time (for real-time sync)
     */
    List<Message> findByConversationIdAndCreatedAtAfterAndIsDeletedFalse(
            UUID conversationId, LocalDateTime after);

    /**
     * Find unread messages for a user in a conversation
     */
    @Query("{ 'conversationId': ?0, 'readBy': { $nin: [?1] }, 'senderId': { $ne: ?1 }, 'isDeleted': false }")
    List<Message> findUnreadMessagesInConversation(UUID conversationId, UUID userId);

    /**
     * Count unread messages for a user in a conversation
     */
    @Query(value = "{ 'conversationId': ?0, 'readBy': { $nin: [?1] }, 'senderId': { $ne: ?1 }, 'isDeleted': false }", count = true)
    long countUnreadMessages(UUID conversationId, UUID userId);

    /**
     * Find messages by type in a conversation
     */
    Page<Message> findByConversationIdAndTypeAndIsDeletedFalse(
            UUID conversationId, MessageType type, Pageable pageable);

    /**
     * Search messages by content
     */
    @Query("{ 'conversationId': ?0, 'content': { $regex: ?1, $options: 'i' }, 'isDeleted': false }")
    Page<Message> searchInConversation(UUID conversationId, String searchText, Pageable pageable);

    /**
     * Find messages sent by a specific user
     */
    Page<Message> findBySenderIdAndIsDeletedFalse(UUID senderId, Pageable pageable);
}
