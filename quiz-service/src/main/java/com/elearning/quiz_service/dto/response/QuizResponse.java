package com.elearning.quiz_service.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class QuizResponse {
    private Long id;
    private String title;
    private Long lessonId;
    private List<QuizQuestionResponse> questions;
}
