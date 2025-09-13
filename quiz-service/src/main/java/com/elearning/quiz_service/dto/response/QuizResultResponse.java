package com.elearning.quiz_service.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QuizResultResponse {
    private Long id;
    private Long quizId;
    private Long userId;
    private int score;
    private LocalDateTime submittedAt;
}
