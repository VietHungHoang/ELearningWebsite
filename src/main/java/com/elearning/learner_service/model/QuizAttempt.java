package com.elearning.learner_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quiz_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long accountId;
    private Long quizId;
    private Double score;
    private Long timeSpent;
    private Long attemptedAt;
}
