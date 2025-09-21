package com.elearning.quiz.repository;

import com.elearning.quiz.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, String> {
    
    // Find quizzes by tutor
    List<Quiz> findByTutorIdAndIsActiveTrueOrderByCreatedAtDesc(String tutorId);
    
    // Find quiz by section
    Optional<Quiz> findBySectionIdAndIsActiveTrue(String sectionId);
    
    // Find quizzes by course
    List<Quiz> findByCourseIdAndIsActiveTrueOrderByCreatedAtDesc(String courseId);
    
    // Find quiz by section and tutor
    Optional<Quiz> findBySectionIdAndTutorIdAndIsActiveTrue(String sectionId, String tutorId);
    
    // Count quizzes by tutor
    @Query("SELECT COUNT(q) FROM Quiz q WHERE q.tutorId = :tutorId AND q.isActive = true")
    Long countByTutorId(@Param("tutorId") String tutorId);
    
    // Find active quizzes
    List<Quiz> findByIsActiveTrueOrderByCreatedAtDesc();
    
    // Search quizzes by title
    @Query("SELECT q FROM Quiz q WHERE q.title LIKE %:title% AND q.isActive = true ORDER BY q.createdAt DESC")
    List<Quiz> findByTitleContainingIgnoreCase(@Param("title") String title);
}
