package com.elearning.learner_service.repository;

import com.elearning.learner_service.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByAccountId(Long accountId);
}
