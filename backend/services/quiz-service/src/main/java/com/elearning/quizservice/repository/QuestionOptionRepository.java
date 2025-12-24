package com.elearning.quizservice.repository;

import com.elearning.quizservice.entity.QuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for QuestionOption entity
 */
@Repository
public interface QuestionOptionRepository extends JpaRepository<QuestionOption, UUID> {
    
    /**
     * Find all options by question ID ordered by index
     */
    List<QuestionOption> findByQuestion_IdAndIsActiveTrueOrderByOrderIndexAsc(UUID questionId);
    
    /**
     * Find active option by ID
     */
    Optional<QuestionOption> findByIdAndIsActiveTrue(UUID id);
    
    /**
     * Find correct options for a question
     */
    List<QuestionOption> findByQuestion_IdAndIsCorrectTrueAndIsActiveTrue(UUID questionId);
    
    /**
     * Count options by question
     */
    Long countByQuestion_IdAndIsActiveTrue(UUID questionId);
    
    /**
     * Count correct options for a question
     */
    Long countByQuestion_IdAndIsCorrectTrueAndIsActiveTrue(UUID questionId);
    
    /**
     * Get max order index for a question
     */
    @Query("SELECT COALESCE(MAX(o.orderIndex), 0) FROM QuestionOption o " +
           "WHERE o.question.id = :questionId AND o.isActive = true")
    Integer findMaxOrderIndexByQuestionId(@Param("questionId") UUID questionId);
    
    /**
     * Find options by multiple IDs
     */
    List<QuestionOption> findByIdInAndIsActiveTrue(List<UUID> ids);
}
