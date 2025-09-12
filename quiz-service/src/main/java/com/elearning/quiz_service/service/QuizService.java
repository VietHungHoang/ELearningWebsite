package com.elearning.quiz_service.service;

import com.elearning.quiz_service.dto.request.QuizRequest;
import com.elearning.quiz_service.dto.request.SubmitAnswerRequest;
import com.elearning.quiz_service.dto.response.QuizResponse;
import com.elearning.quiz_service.dto.response.QuizQuestionResponse;
import com.elearning.quiz_service.dto.response.SubmitAnswerResponse;

import java.util.List;
import java.util.Optional;

public interface IQuizService {
    List<QuizResponse> getAllQuizzesByLesson(Long lessonId);
    Optional<QuizResponse> getQuiz(Long id);
    QuizResponse saveQuiz(QuizRequest request);
    Optional<QuizQuestionResponse> getQuestion(Long quizId, int questionIndex);
    SubmitAnswerResponse submitAnswer(Long quizId, SubmitAnswerRequest request);
}
