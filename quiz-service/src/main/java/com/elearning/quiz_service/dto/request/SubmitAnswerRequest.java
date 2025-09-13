package com.elearning.quiz_service.dto.request;

import lombok.Data;

@Data
public class SubmitAnswerRequest {
    private Long userId;     // ai làm quiz
    private Long questionId;
    private Long answerId;
    private int questionIndex;
}
