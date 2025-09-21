package com.elearning.quiz.repository;

import com.elearning.quiz.model.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, String> {
    
    // Find questions by quiz ID ordered by order index
    List<QuizQuestion> findByQuizIdOrderByOrderIndexAsc(String quizId);
    
    // Find questions by quiz ID
    List<QuizQuestion> findByQuizId(String quizId);
    
    // Count questions by quiz ID
    @Query("SELECT COUNT(q) FROM QuizQuestion q WHERE q.quizId = :quizId")
    Long countByQuizId(@Param("quizId") String quizId);
    
    // Find question by quiz ID and order index
    Optional<QuizQuestion> findByQuizIdAndOrderIndex(String quizId, Integer orderIndex);
    
    // Delete questions by quiz ID
    void deleteByQuizId(String quizId);
}
