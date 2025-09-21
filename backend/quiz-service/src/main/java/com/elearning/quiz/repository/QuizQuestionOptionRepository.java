package com.elearning.quiz.repository;

import com.elearning.quiz.model.QuizQuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionOptionRepository extends JpaRepository<QuizQuestionOption, String> {
    
    // Find options by question ID ordered by order index
    List<QuizQuestionOption> findByQuestionIdOrderByOrderIndexAsc(String questionId);
    
    // Find options by question ID
    List<QuizQuestionOption> findByQuestionId(String questionId);
    
    // Find correct option by question ID
    @Query("SELECT o FROM QuizQuestionOption o WHERE o.questionId = :questionId AND o.isCorrect = true")
    List<QuizQuestionOption> findCorrectOptionsByQuestionId(@Param("questionId") String questionId);
    
    // Count options by question ID
    @Query("SELECT COUNT(o) FROM QuizQuestionOption o WHERE o.questionId = :questionId")
    Long countByQuestionId(@Param("questionId") String questionId);
    
    // Delete options by question ID
    void deleteByQuestionId(String questionId);
}
