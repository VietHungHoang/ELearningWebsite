package com.elearning.chat_service.repository;


import com.elearning.chat_service.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ConversationRepository extends MongoRepository<Conversation, String> {
    boolean existsByCourseIdAndLearnerIdAndInstructorId(String courseId, String learnerId, String instructorId);
    List<Conversation> findByParticipantIdsContains(String userId);
}
