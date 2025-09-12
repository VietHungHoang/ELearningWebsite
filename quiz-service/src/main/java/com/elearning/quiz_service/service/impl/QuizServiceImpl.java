package com.elearning.quiz_service.service.impl;

import com.elearning.quiz_service.dto.request.*;
import com.elearning.quiz_service.dto.response.*;
import com.elearning.quiz_service.model.*;
import com.elearning.quiz_service.repository.*;
import com.elearning.quiz_service.service.IQuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements IQuizService {

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizAnswerRepository quizAnswerRepository;
    private final LessonRepository lessonRepository;

    private final Map<Long, List<Long>> userAnswers = new HashMap<>(); // Map<quizId, List<answerId>>

    @Override
    public List<QuizResponse> getAllQuizzesByLesson(Long lessonId) {
        return quizRepository.findByLessonId(lessonId).stream()
                .map(this::mapToQuizResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<QuizResponse> getQuiz(Long id) {
        return quizRepository.findById(id).map(this::mapToQuizResponse);
    }

    @Override
    @Transactional
    public QuizResponse saveQuiz(QuizRequest request) {
        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setLesson(lesson);

        List<QuizQuestion> questions = request.getQuestions().stream().map(qReq -> {
            QuizQuestion question = new QuizQuestion();
            question.setQuestionText(qReq.getQuestionText());
            question.setQuiz(quiz);

            List<QuizAnswer> answers = qReq.getAnswers().stream().map(aReq -> {
                QuizAnswer answer = new QuizAnswer();
                answer.setAnswerText(aReq.getAnswerText());
                answer.setCorrect(aReq.isCorrect());
                answer.setQuestion(question);
                return answer;
            }).collect(Collectors.toList());

            question.setAnswers(answers);
            return question;
        }).collect(Collectors.toList());

        quiz.setQuestions(questions);
        Quiz savedQuiz = quizRepository.save(quiz);

        return mapToQuizResponse(savedQuiz);
    }

    @Override
    public Optional<QuizQuestionResponse> getQuestion(Long quizId, int questionIndex) {
        return quizRepository.findById(quizId)
                .filter(quiz -> questionIndex >= 0 && questionIndex < quiz.getQuestions().size())
                .map(quiz -> mapToQuestionResponse(quiz.getQuestions().get(questionIndex)));
    }

    @Override
    @Transactional
    public SubmitAnswerResponse submitAnswer(Long quizId, SubmitAnswerRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));

        QuizQuestion question = quizQuestionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));

        QuizAnswer answer = quizAnswerRepository.findById(request.getAnswerId())
                .orElseThrow(() -> new IllegalArgumentException("Answer not found"));

        if (!question.getQuiz().getId().equals(quizId)) {
            throw new IllegalArgumentException("Question does not belong to this quiz");
        }

        if (!answer.getQuestion().getId().equals(question.getId())) {
            throw new IllegalArgumentException("Answer does not belong to this question");
        }

        userAnswers.computeIfAbsent(quizId, k -> new ArrayList<>()).add(answer.getId());

        SubmitAnswerResponse response = new SubmitAnswerResponse();
