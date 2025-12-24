package com.elearning.quizservice.dto.response;

import com.elearning.quizservice.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO for question details
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {
    
    private UUID id;
    private String questionText;
    private Question.QuestionType type;
    private Integer orderIndex;
    private String explanation;
    private List<QuestionOptionResponse> options;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionOptionResponse {
        private UUID id;
        private String optionText;
        private Integer orderIndex;
        private Boolean isCorrect; // Only included for tutor view
    }
}
