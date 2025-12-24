package com.elearning.quizservice.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Request DTO for submitting an answer
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitAnswerRequest {
    
    @NotNull(message = "Question ID is required")
    private UUID questionId;
    
    @NotNull(message = "Selected option IDs are required")
    private List<UUID> selectedOptionIds;
}
