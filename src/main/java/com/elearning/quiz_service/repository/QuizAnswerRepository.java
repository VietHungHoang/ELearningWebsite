package com.elearning.quiz_service.repository;

import com.elearning.quiz_service.model.QuizAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizAnswerRepository extends JpaRepository<QuizAnswer, Long> {
}
