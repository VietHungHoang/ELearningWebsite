package com.elearning.quiz_service.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class QuizQuestionRequest {
    private String questionText;
    private List<QuizAnswerRequest> answers;
}
