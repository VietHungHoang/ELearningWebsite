package com.elearning.quizservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Response DTO for quiz statistics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizStatisticsResponse {
    
    private UUID quizId;
    private String quizTitle;
    private Long totalAttempts;
    private Long completedAttempts;
    private Double averagePercentage;
    private Double passRate;
    private Integer averageTimeSpent;
    private List<QuestionStatistics> questionStatistics;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionStatistics {
        private UUID questionId;
        private String questionText;
        private Integer orderIndex;
        private Long totalAnswers;
        private Long correctAnswers;
        private Double correctRate;
        private List<OptionStatistics> optionStatistics;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptionStatistics {
        private UUID optionId;
        private String optionText;
        private Boolean isCorrect;
        private Long selectedCount;
        private Double selectedRate;
    }
}
