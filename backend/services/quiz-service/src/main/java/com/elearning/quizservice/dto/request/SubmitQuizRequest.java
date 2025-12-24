package com.elearning.quizservice.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for submitting a quiz
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitQuizRequest {
    
    @NotNull(message = "Answers are required")
    @Valid
    private List<SubmitAnswerRequest> answers;
}
