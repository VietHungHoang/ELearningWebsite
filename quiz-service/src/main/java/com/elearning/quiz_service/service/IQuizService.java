package com.elearning.quiz_service.service;

import com.elearning.quiz_service.dto.request.QuizRequest;
import com.elearning.quiz_service.dto.request.SubmitAnswerRequest;
import com.elearning.quiz_service.dto.response.QuizResponse;
import com.elearning.quiz_service.dto.response.QuizQuestionResponse;
import com.elearning.quiz_service.dto.response.SubmitAnswerResponse;

import java.util.List;
import java.util.Optional;

import com.elearning.quiz_service.dto.response.QuizResultResponse;

public interface IQuizService {
    List<QuizResponse> getAllQuizzesByLesson(Long lessonId);
    Optional<QuizResponse> getQuiz(Long id);
    QuizResponse saveQuiz(QuizRequest request);
    Optional<QuizQuestionResponse> getQuestion(Long quizId, int questionIndex);
    SubmitAnswerResponse submitAnswer(Long quizId, SubmitAnswerRequest request);

    // NEW: cập nhật status của quiz (ví dụ từ DRAFT -> PUBLISHED)
    QuizResponse updateQuizStatus(Long quizId, String status);

    // NEW: lấy kết quả làm quiz của 1 user
    List<QuizResultResponse> getResultsByUser(Long userId);
}
