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

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {

    /**
     * Find messages in a conversation with pagination
     */
    Page<Message> findByConversationIdAndIsDeletedFalseOrderByCreatedAtDesc(
            String conversationId, Pageable pageable);

    /**
     * Find messages after a specific time (for real-time sync)
     */
    List<Message> findByConversationIdAndCreatedAtAfterAndIsDeletedFalse(
            String conversationId, LocalDateTime after);

    /**
     * Find unread messages for a user in a conversation
     */
    @Query("{ 'conversationId': ?0, 'readBy': { $nin: [?1] }, 'senderId': { $ne: ?1 }, 'isDeleted': false }")
    List<Message> findUnreadMessagesInConversation(String conversationId, String userId);

    /**
     * Count unread messages for a user in a conversation
     */
    @Query(value = "{ 'conversationId': ?0, 'readBy': { $nin: [?1] }, 'senderId': { $ne: ?1 }, 'isDeleted': false }", count = true)
    long countUnreadMessages(String conversationId, String userId);

    /**
     * Find messages by type in a conversation
     */
    Page<Message> findByConversationIdAndTypeAndIsDeletedFalse(
            String conversationId, MessageType type, Pageable pageable);

    /**
     * Search messages by content
     */
    @Query("{ 'conversationId': ?0, 'content': { $regex: ?1, $options: 'i' }, 'isDeleted': false }")
    Page<Message> searchInConversation(String conversationId, String searchText, Pageable pageable);

    /**
     * Find messages sent by a specific user
     */
    Page<Message> findBySenderIdAndIsDeletedFalse(String senderId, Pageable pageable);
}
