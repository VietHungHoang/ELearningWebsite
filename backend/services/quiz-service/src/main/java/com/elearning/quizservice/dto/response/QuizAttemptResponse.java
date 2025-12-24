package com.elearning.quizservice.dto.response;

import com.elearning.quizservice.entity.QuizAttempt;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for quiz attempt
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptResponse {
    
    private UUID id;
    private UUID quizId;
    private UUID studentId;
    private Integer attemptNumber;
    private QuizAttempt.AttemptStatus status;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private Integer correctAnswers;
    private Integer totalQuestions;
    private Double percentage;
    private Boolean passed;
    private LocalDateTime createdAt;
}
