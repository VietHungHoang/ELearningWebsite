package com.elearning.quizservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Response DTO for quiz result/review
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultResponse {
    
    private UUID attemptId;
    private UUID quizId;
    private String quizTitle;
    private Integer correctAnswers;
    private Integer totalQuestions;
    private Double percentage;
    private Boolean passed;
    private List<QuestionResultResponse> questions;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionResultResponse {
        private UUID questionId;
        private String questionText;
        private Boolean isCorrect;
        private List<OptionResultResponse> options;
        private String explanation;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptionResultResponse {
        private UUID optionId;
        private String optionText;
        private Boolean isCorrect;
        private Boolean isSelected;
    }
}
