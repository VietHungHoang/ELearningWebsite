package com.elearning.quizservice.repository;

import com.elearning.quizservice.entity.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for StudentAnswer entity
 */
@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, UUID> {
    
    /**
     * Find all answers by attempt
     */
    List<StudentAnswer> findByAttempt_Id(UUID attemptId);
    
    /**
     * Find answer by attempt and question
     */
    Optional<StudentAnswer> findByAttempt_IdAndQuestion_Id(UUID attemptId, UUID questionId);
    
    /**
     * Count answers by attempt
     */
    Long countByAttempt_Id(UUID attemptId);
    
    /**
     * Count correct answers by attempt
     */
    Long countByAttempt_IdAndIsCorrectTrue(UUID attemptId);
    
    /**
     * Get answers for specific questions in an attempt
     */
    List<StudentAnswer> findByAttempt_IdAndQuestion_IdIn(UUID attemptId, List<UUID> questionIds);
    
    /**
     * Delete all answers for an attempt
     */
    void deleteByAttempt_Id(UUID attemptId);
    
    /**
     * Find answers by question (for analytics)
     */
    List<StudentAnswer> findByQuestion_Id(UUID questionId);
    
    /**
     * Get correct answer rate for a question
     */
    @Query("SELECT COUNT(sa) * 100.0 / (SELECT COUNT(sa2) FROM StudentAnswer sa2 " +
           "WHERE sa2.question.id = :questionId) " +
           "FROM StudentAnswer sa WHERE sa.question.id = :questionId AND sa.isCorrect = true")
    Double getCorrectRateByQuestionId(@Param("questionId") UUID questionId);
}
