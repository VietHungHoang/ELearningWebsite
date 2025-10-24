package com.elearning.learner_bff_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttemptResponse {
    private Long attemptId;
    private Long accountId;
    private Long quizId;
    private Integer score;
    private Double passingScore;
    private String status;
    private java.time.LocalDateTime attemptDate;
    private Integer totalQuestions;
    private Integer correctAnswers;
}
