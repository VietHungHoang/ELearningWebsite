package com.elearning.quiz_service.repository;

import com.elearning.quiz_service.model.QuizResult;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long>{
    List<QuizResult> findByUserId(Long userId);
    List<QuizResult> findByQuizId(Long quizId);
}
