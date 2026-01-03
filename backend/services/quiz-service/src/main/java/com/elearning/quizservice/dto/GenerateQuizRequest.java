package com.elearning.quizservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenerateQuizRequest {
    
    @NotBlank(message = "Prompt cannot be empty")
    @Size(min = 10, max = 2000, message = "Prompt must be between 10 and 2000 characters")
    private String prompt;
}
