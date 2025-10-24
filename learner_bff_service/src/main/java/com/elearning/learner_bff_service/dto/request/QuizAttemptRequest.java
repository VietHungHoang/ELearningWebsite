package com.elearning.learner_bff_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptRequest {
    private Long accountId;
    private Long courseId;
    private String questions;
    private Double score;
}
