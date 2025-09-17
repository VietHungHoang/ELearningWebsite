package com.elearning.quiz_service.repository;

import com.elearning.quiz_service.model.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByUserId(Long userId);

    List<QuizResult> findByQuizId(Long quizId);
}
