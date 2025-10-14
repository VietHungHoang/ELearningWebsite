package com.elearning.learner_service.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttemptRequest {
    private Long accountId;
    private Long quizId;
    private Double score; // điểm đạt được
    private Long timeSpent; // thời gian làm quiz (ms)
}
