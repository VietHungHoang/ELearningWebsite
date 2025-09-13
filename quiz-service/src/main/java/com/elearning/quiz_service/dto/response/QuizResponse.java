package com.elearning.quiz_service.dto.response;

import com.elearning.quiz_service.enums.QuizStatus;
import lombok.Data;
import java.util.List;

@Data
public class QuizResponse {
    private Long id;
    private String title;
    private Long lessonId;
    private QuizStatus status;
    private List<QuizQuestionResponse> questions;
}
