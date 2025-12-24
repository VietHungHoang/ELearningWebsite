package com.elearning.quizservice.dto.request;

import com.elearning.quizservice.entity.Question;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for creating a question
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuestionRequest {
    
    @NotBlank(message = "Question text is required")
    private String questionText;
    
    @NotNull(message = "Question type is required")
    private Question.QuestionType type;
    
    private String explanation;
    
    @NotNull(message = "Options are required")
    private List<QuestionOptionRequest> options;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionOptionRequest {
        @NotBlank(message = "Option text is required")
        private String optionText;
        
        @NotNull(message = "isCorrect flag is required")
        private Boolean isCorrect;
    }
}
