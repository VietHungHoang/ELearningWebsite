package com.elearning.quiz_service.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class QuizQuestionResponse {
    private Long id;
    private String questionText;
    private List<QuizAnswerResponse> answers;
}
