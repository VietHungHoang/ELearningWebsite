viì package com.elearning.quizservice.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Request DTO for updating a quiz
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateQuizRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;
    
    private String description;
    
    @NotNull(message = "Time limit is required")
    @Min(value = 1, message = "Time limit must be at least 1 minute")
    private Integer timeLimitMinutes;
    
    private LocalDateTime dueDate;
    
    @Min(value = 0, message = "Passing score must be at least 0")
    private Integer passingScore;
    
    private Boolean shuffleQuestions;
    
    private Boolean showCorrectAnswers;
    
    @Min(value = 1, message = "Max attempts must be at least 1")
    private Integer maxAttempts;
}
