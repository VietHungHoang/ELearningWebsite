package com.elearning.quiz_service.dto.request;

import lombok.Data;

@Data
public class SubmitAnswerRequest {
    private Long questionId;
    private Long answerId;
    private int questionIndex;
}
