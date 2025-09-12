package com.elearning.quiz_service.dto.response;

import lombok.Data;

@Data
public class SubmitAnswerResponse {
    private Long questionId;
    private boolean isCorrect;
    private QuizQuestionResponse nextQuestion;
    private Integer nextQuestionIndex;
    private Boolean quizCompleted;
    private Integer score;
}
