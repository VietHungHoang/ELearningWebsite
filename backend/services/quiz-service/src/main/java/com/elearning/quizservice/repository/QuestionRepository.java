package com.elearning.quizservice.repository;

import com.elearning.quizservice.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Question entity
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {
    
    /**
     * Find all questions by quiz ID ordered by index
     */
    List<Question> findByQuiz_IdAndIsActiveTrueOrderByOrderIndexAsc(UUID quizId);
    
    /**
     * Find active question by ID
     */
    Optional<Question> findByIdAndIsActiveTrue(UUID id);
    
    /**
     * Count questions by quiz
     */
    Long countByQuiz_IdAndIsActiveTrue(UUID quizId);
    
    /**
     * Find questions by type
     */
    List<Question> findByQuiz_IdAndTypeAndIsActiveTrueOrderByOrderIndexAsc(
        UUID quizId, Question.QuestionType type);
    
    /**
     * Get max order index for a quiz
     */
    @Query("SELECT COALESCE(MAX(q.orderIndex), 0) FROM Question q " +
           "WHERE q.quiz.id = :quizId AND q.isActive = true")
    Integer findMaxOrderIndexByQuizId(@Param("quizId") UUID quizId);
}
