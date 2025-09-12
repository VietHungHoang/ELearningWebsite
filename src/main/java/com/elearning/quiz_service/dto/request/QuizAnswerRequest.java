package com.elearning.quiz_service.dto.request;

import lombok.Data;

@Data
public class QuizAnswerRequest {
    private String answerText;
    private boolean correct;
}
