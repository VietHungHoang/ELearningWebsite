package com.elearning.quizservice.service.impl;

import com.elearning.quizservice.dto.request.CreateQuestionRequest;
import com.elearning.quizservice.dto.request.CreateQuizRequest;
import com.elearning.quizservice.dto.request.UpdateQuizRequest;
import com.elearning.quizservice.dto.response.QuestionResponse;
import com.elearning.quizservice.dto.response.QuizDetailResponse;
import com.elearning.quizservice.dto.response.QuizSummaryResponse;
import com.elearning.quizservice.entity.Quiz;
import com.elearning.quizservice.exception.InvalidOperationException;
import com.elearning.quizservice.exception.ResourceNotFoundException;
import com.elearning.quizservice.exception.ValidationException;
import com.elearning.quizservice.mapper.QuizMapper;
import com.elearning.quizservice.repository.QuizAttemptRepository;
import com.elearning.quizservice.repository.QuizRepository;
import com.elearning.quizservice.service.QuestionService;
import com.elearning.quizservice.service.QuizService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Implementation of QuizService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {
    
    private final QuizRepository quizRepository;
    private final QuizAttemptRepository attemptRepository;
    private final QuestionService questionService;
    private final QuizMapper quizMapper;
    
    @Override
    @Transactional
    public QuizDetailResponse createQuiz(UUID creatorId, CreateQuizRequest request) {
        log.info("Creating quiz for creator: {}", creatorId);
        
        // Create quiz
        Quiz quiz = Quiz.builder()
                .classId(request.getClassId())
                .creatorId(creatorId)
                .title(request.getTitle())
                .description(request.getDescription())
                .timeLimitMinutes(request.getTimeLimitMinutes())
                .status(Quiz.QuizStatus.DRAFT)
                .dueDate(request.getDueDate())
                .passingScore(request.getPassingScore() != null ? request.getPassingScore() : 60)
                .shuffleQuestions(request.getShuffleQuestions() != null ? request.getShuffleQuestions() : false)
                .showCorrectAnswers(request.getShowCorrectAnswers() != null ? request.getShowCorrectAnswers() : true)
                .maxAttempts(request.getMaxAttempts() != null ? request.getMaxAttempts() : 1)
                .isActive(true)
                .build();
        
        quiz = quizRepository.save(quiz);
        
        // Create questions if provided
        if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
            for (CreateQuestionRequest questionRequest : request.getQuestions()) {
                questionService.createQuestion(quiz, questionRequest);
            }
            
            quiz = quizRepository.save(quiz);
        }
        
        log.info("Created quiz: {}", quiz.getId());
        
        // Get detail response with questions
        return getQuizDetail(quiz.getId(), true);
    }
    
    @Override
    public Quiz getQuizById(UUID quizId) {
        return quizRepository.findByIdAndIsActiveTrue(quizId)
                .orElseThrow(() -> ResourceNotFoundException.quiz(quizId.toString()));
    }
    
    @Override
    public QuizDetailResponse getQuizDetail(UUID quizId, boolean includeAnswers) {
        Quiz quiz = getQuizById(quizId);
        QuizDetailResponse response = quizMapper.toDetailResponse(quiz);
        
        // Add questions
        List<QuestionResponse> questions = questionService.getQuestionResponsesByQuizId(quizId, includeAnswers);
        response.setQuestions(questions);
        
        return response;
    }
    
    @Override
    public List<QuizSummaryResponse> getQuizzesByClass(UUID classId) {
        List<Quiz> quizzes = quizRepository.findByClassIdAndIsActiveTrue(classId);
        return quizzes.stream()
                .map(this::toSummaryWithStats)
                .toList();
    }
    
    @Override
    public List<QuizSummaryResponse> getQuizzesByCreator(UUID creatorId) {
        List<Quiz> quizzes = quizRepository.findByCreatorIdAndIsActiveTrue(creatorId);
        return quizzes.stream()
                .map(this::toSummaryWithStats)
                .toList();
    }
    
    @Override
    @Transactional
    public QuizDetailResponse updateQuiz(UUID quizId, UpdateQuizRequest request) {
        log.info("Updating quiz: {}", quizId);
        
        Quiz quiz = getQuizById(quizId);
        
        // Check if quiz can be updated
        if (quiz.getStatus() == Quiz.QuizStatus.ACTIVE) {
            Long attemptCount = attemptRepository.countByQuizIdAndStatus(
                    quizId, com.elearning.quizservice.entity.QuizAttempt.AttemptStatus.SUBMITTED);
            if (attemptCount > 0) {
                throw InvalidOperationException.quizAlreadyPublished();
            }
        }
        
        // Update fields
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        quiz.setDueDate(request.getDueDate());
        quiz.setPassingScore(request.getPassingScore() != null ? request.getPassingScore() : 60);
        quiz.setShuffleQuestions(request.getShuffleQuestions() != null ? request.getShuffleQuestions() : false);
        quiz.setShowCorrectAnswers(request.getShowCorrectAnswers() != null ? request.getShowCorrectAnswers() : true);
        quiz.setMaxAttempts(request.getMaxAttempts() != null ? request.getMaxAttempts() : 1);
        
        quizRepository.save(quiz);
        
        log.info("Updated quiz: {}", quizId);
        return getQuizDetail(quizId, true);
    }
    
    @Override
    @Transactional
    public void deleteQuiz(UUID quizId) {
        log.info("Deleting quiz: {}", quizId);
        
        Quiz quiz = getQuizById(quizId);
        quiz.setIsActive(false);
        quizRepository.save(quiz);
        
        log.info("Deleted quiz: {}", quizId);
    }
    
    @Override
    @Transactional
    public QuizDetailResponse publishQuiz(UUID quizId) {
        log.info("Publishing quiz: {}", quizId);
        
        Quiz quiz = getQuizById(quizId);
        
        // Validate quiz has questions
        Long questionCount = questionService.getQuestionsByQuizId(quizId).size();
        if (questionCount == 0) {
            throw ValidationException.noQuestions();
        }
        
        // Check if already published
        if (quiz.getStatus() == Quiz.QuizStatus.ACTIVE) {
            throw InvalidOperationException.quizAlreadyPublished();
        }
        
        // Publish
        quiz.setStatus(Quiz.QuizStatus.ACTIVE);
        quiz.setPublishedAt(LocalDateTime.now());
        quiz.setTotalQuestions(questionCount.intValue());
        quizRepository.save(quiz);
        
        log.info("Published quiz: {}", quizId);
        return getQuizDetail(quizId, true);
    }
    
    @Override
    @Transactional
    public void archiveQuiz(UUID quizId) {
        log.info("Archiving quiz: {}", quizId);
        
        Quiz quiz = getQuizById(quizId);
        quiz.setStatus(Quiz.QuizStatus.ARCHIVED);
        quizRepository.save(quiz);
        
        log.info("Archived quiz: {}", quizId);
    }
    
    @Override
    public List<QuizSummaryResponse> searchQuizzes(UUID classId, String searchTerm) {
        List<Quiz> quizzes = quizRepository.searchByClassId(classId, searchTerm);
        return quizzes.stream()
                .map(this::toSummaryWithStats)
                .toList();
    }
    
    @Override
    public void validateQuizAccess(UUID quizId) {
        Quiz quiz = getQuizById(quizId);
        
        // Check if quiz is published
        if (quiz.getStatus() != Quiz.QuizStatus.ACTIVE) {
            throw InvalidOperationException.quizNotPublished();
        }
        
        // Check if quiz is expired
        if (quiz.getDueDate() != null && quiz.getDueDate().isBefore(LocalDateTime.now())) {
            throw InvalidOperationException.quizExpired();
        }
    }
    
    /**
     * Convert quiz to summary response with statistics
     */
    private QuizSummaryResponse toSummaryWithStats(Quiz quiz) {
        Long totalAttempts = attemptRepository.countByQuizIdAndStatus(
                quiz.getId(), com.elearning.quizservice.entity.QuizAttempt.AttemptStatus.GRADED);
        Double avgScore = attemptRepository.getAverageScoreByQuizId(quiz.getId());
        Double highScore = attemptRepository.getHighestScoreByQuizId(quiz.getId());
        
        return quizMapper.toSummaryResponse(quiz, totalAttempts, avgScore, highScore);
    }
}
