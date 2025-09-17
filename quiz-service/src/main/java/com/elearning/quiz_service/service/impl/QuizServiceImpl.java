package com.elearning.quiz_service.service.impl;

import com.elearning.quiz_service.dto.request.*;
import com.elearning.quiz_service.dto.response.*;
import com.elearning.quiz_service.enums.QuizStatus;
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
    private final QuizResultRepository quizResultRepository;

    // tạm giữ câu trả lời theo quiz
    private final Map<Long, List<Long>> userAnswers = new HashMap<>();

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
        quiz.setStatus(request.getStatus() != null ? request.getStatus() : QuizStatus.DRAFT);

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
        response.setQuestionId(question.getId());
        response.setCorrect(answer.isCorrect());

        // nếu user làm xong tất cả câu hỏi thì tính điểm + lưu kết quả
        int answered = userAnswers.get(quizId).size();
        int totalQuestions = quiz.getQuestions().size();
        if (answered == totalQuestions) {
            int score = calculateScore(quizId);

            QuizResult result = new QuizResult();
            result.setQuiz(quiz);
            result.setUserId(request.getUserId());
            result.setScore(score);
            quizResultRepository.save(result);

            response.setQuizCompleted(true);
            response.setScore(score);

            userAnswers.remove(quizId); // reset
        }

        return response;
    }

    // ================= MAPPING ===================
    private QuizResponse mapToQuizResponse(Quiz quiz) {
        QuizResponse dto = new QuizResponse();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setLessonId(quiz.getLesson().getId());
        dto.setStatus(quiz.getStatus());
        dto.setQuestions(
                quiz.getQuestions().stream()
                        .map(this::mapToQuestionResponse)
                        .collect(Collectors.toList())
        );
        return dto;
    }

    private QuizQuestionResponse mapToQuestionResponse(QuizQuestion question) {
        QuizQuestionResponse dto = new QuizQuestionResponse();
        dto.setId(question.getId());
        dto.setQuestionText(question.getQuestionText());
        dto.setAnswers(
                question.getAnswers().stream()
                        .map(a -> new QuizAnswerResponse(a.getId(), a.getAnswerText()))
                        .collect(Collectors.toList())
        );
        return dto;
    }

    private int calculateScore(Long quizId) {
        List<Long> answers = userAnswers.getOrDefault(quizId, new ArrayList<>());
        int score = 0;
        for (Long answerId : answers) {
            quizAnswerRepository.findById(answerId)
                    .filter(QuizAnswer::isCorrect)
                    .ifPresent(a -> score++);
        }
        return score;
    }
        @Override
    public QuizResponse updateQuizStatus(Long quizId, String status) {
        // TODO: Thêm logic update status trong DB (DRAFT, PUBLISHED, ...)
        return QuizResponse.builder()
                .id(quizId)
                .status(status)
                .build();
    }

    @Override
    public List<QuizResultResponse> getResultsByUser(Long userId) {
        // TODO: Lấy kết quả quiz từ DB theo userId
        return List.of();
    }

}
