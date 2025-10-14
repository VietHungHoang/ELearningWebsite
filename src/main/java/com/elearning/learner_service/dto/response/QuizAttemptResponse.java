package com.elearning.learner_service.dto.response;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttemptResponse {
    private Long id;
    private Long accountId;
    private Long quizId;
    private String quizTitle;

    private Long attemptedAt; // ngày làm quiz
    private Integer totalQuestions; // tổng số câu hỏi
    private Integer maxScore; // tổng điểm tối đa
    private Integer score; // điểm đạt được
    private String result; // Pass / Fail
}
