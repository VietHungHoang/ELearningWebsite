package com.elearning.quiz_service.dto.request;

import com.elearning.quiz_service.enums.QuizStatus;
import lombok.Data;
import java.util.List;

@Data
public class QuizRequest {
    private String title;
    private Long lessonId;
    private List<QuizQuestionRequest> questions;
    private QuizStatus status; // DRAFT hoặc PUBLISHED
    private List<QuizQuestionRequest> questions;
}
