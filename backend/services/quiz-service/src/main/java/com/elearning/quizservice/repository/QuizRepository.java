package com.elearning.quizservice.repository;

import com.elearning.quizservice.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Quiz entity
 */
@Repository
public interface QuizRepository extends JpaRepository<Quiz, UUID> {
    
    /**
     * Find all quizzes by class ID
     */
    List<Quiz> findByClassIdAndIsActiveTrue(UUID classId);
    
    /**
     * Find all quizzes created by a tutor
     */
    List<Quiz> findByCreatorIdAndIsActiveTrue(UUID creatorId);
    
    /**
     * Find active quiz by ID
     */
    Optional<Quiz> findByIdAndIsActiveTrue(UUID id);
    
    /**
     * Find quizzes by status
     */
    List<Quiz> findByStatusAndIsActiveTrue(Quiz.QuizStatus status);
    
    /**
     * Find quizzes by class and status
     */
    List<Quiz> findByClassIdAndStatusAndIsActiveTrue(UUID classId, Quiz.QuizStatus status);
    
    /**
     * Count quizzes by class
     */
    Long countByClassIdAndIsActiveTrue(UUID classId);
    
    /**
     * Count quizzes by creator
     */
    Long countByCreatorIdAndIsActiveTrue(UUID creatorId);
    
    /**
     * Find quizzes by class with search
     */
    @Query("SELECT q FROM Quiz q WHERE q.classId = :classId " +
           "AND q.isActive = true " +
           "AND (LOWER(q.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(q.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Quiz> searchByClassId(@Param("classId") UUID classId, @Param("search") String search);
}
