package com.elearning.tutorservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerateIntroductionRequest {
    
    /**
     * Prompt from user describing what kind of introduction they want
     */
    private String prompt;
}
