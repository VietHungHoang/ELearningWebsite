package com.elearning.quizservice.service.impl;

import com.elearning.quizservice.dto.request.CreateQuestionRequest;
import com.elearning.quizservice.dto.request.CreateQuizRequest;
import com.elearning.quizservice.dto.request.UpdateQuizRequest;
import com.elearning.quizservice.dto.response.QuestionResponse;
import com.elearning.quizservice.dto.response.QuizDetailResponse;
import com.elearning.quizservice.dto.response.QuizSummaryResponse;
import com.elearning.quizservice.dto.response.StudentQuizSummaryResponse;
import com.elearning.quizservice.entity.Quiz;
import com.elearning.quizservice.entity.QuizAttempt;
import com.elearning.quizservice.entity.StudentQuizStatus;
import com.elearning.quizservice.entity.User;
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

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

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
    
    @Override
    @Transactional(readOnly = true)
    public List<StudentQuizSummaryResponse> getQuizzesForStudent(UUID studentId, StudentQuizStatus statusFilter) {
        log.info("Getting quizzes for student: {} with status filter: {}", studentId, statusFilter);
        
        // Get all published quizzes with creator info
        List<Quiz> quizzes = quizRepository.findAllPublishedQuizzesWithCreator();
        
        // Get student's latest attempts for all quizzes
        List<QuizAttempt> latestAttempts = attemptRepository.findLatestAttemptsByStudentId(studentId);
        Map<UUID, QuizAttempt> attemptsByQuizId = latestAttempts.stream()
                .collect(Collectors.toMap(a -> a.getQuiz().getId(), a -> a));
        
        // Build response list
        List<StudentQuizSummaryResponse> result = new ArrayList<>();
        
        for (Quiz quiz : quizzes) {
            QuizAttempt latestAttempt = attemptsByQuizId.get(quiz.getId());
            StudentQuizStatus studentStatus = calculateStudentStatus(latestAttempt);
            
            // Apply filter if specified
            if (statusFilter != null && studentStatus != statusFilter) {
                continue;
            }
            
            StudentQuizSummaryResponse response = buildStudentQuizSummary(quiz, latestAttempt, studentStatus);
            result.add(response);
        }
        
        return result;
    }
    
    /**
     * Calculate student's status for a quiz based on their latest attempt
     */
    private StudentQuizStatus calculateStudentStatus(QuizAttempt latestAttempt) {
        if (latestAttempt == null) {
            return StudentQuizStatus.NOT_STARTED;
        }
        
        return switch (latestAttempt.getStatus()) {
            case IN_PROGRESS -> StudentQuizStatus.IN_PROGRESS;
            case SUBMITTED, GRADED -> StudentQuizStatus.COMPLETED;
            case ABANDONED -> StudentQuizStatus.NOT_STARTED; // Can retry
        };
    }
    
    /**
     * Build StudentQuizSummaryResponse from quiz and attempt data
     */
    private StudentQuizSummaryResponse buildStudentQuizSummary(Quiz quiz, QuizAttempt latestAttempt, StudentQuizStatus studentStatus) {
        User creator = quiz.getCreator();
        
        StudentQuizSummaryResponse.StudentQuizSummaryResponseBuilder builder = StudentQuizSummaryResponse.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .totalQuestions(quiz.getQuestions() != null ? quiz.getQuestions().size() : 0)
                .timeLimitMinutes(quiz.getTimeLimitMinutes())
                .passingScore(quiz.getPassingScore())
                .dueDate(quiz.getDueDate())
                .studentStatus(studentStatus)
                .tutorName(creator != null ? creator.getFullName() : null)
                .tutorAvatar(creator != null ? creator.getAvatarUrl() : null)
                .assignedAt(quiz.getPublishedAt())
                .createdAt(quiz.getCreatedAt());
        
        // Add attempt-specific data
        if (latestAttempt != null) {
            builder.currentAttemptId(latestAttempt.getId());
            
            if (studentStatus == StudentQuizStatus.IN_PROGRESS) {
                // Calculate time remaining
                builder.questionsAnswered(latestAttempt.getAnswersCount());
                
                if (latestAttempt.getStartedAt() != null && quiz.getTimeLimitMinutes() != null) {
                    long elapsedSeconds = Duration.between(latestAttempt.getStartedAt(), LocalDateTime.now()).getSeconds();
                    long totalSeconds = quiz.getTimeLimitMinutes() * 60L;
                    int remainingSeconds = (int) Math.max(0, totalSeconds - elapsedSeconds);
                    builder.timeRemainingSeconds(remainingSeconds);
                }
            } else if (studentStatus == StudentQuizStatus.COMPLETED) {
                builder.score(latestAttempt.getCorrectAnswers())
                        .maxScore(latestAttempt.getTotalQuestions())
                        .percentage(latestAttempt.getPercentage())
                        .passed(latestAttempt.getPassed())
                        .completedAt(latestAttempt.getSubmittedAt());
            }
        }
        
        return builder.build();
    }
    
    /**
     * Convert quiz to summary response with statistics
     */
    private QuizSummaryResponse toSummaryWithStats(Quiz quiz) {
        Long totalAttempts = attemptRepository.countByQuizIdAndStatus(
                quiz.getId(), QuizAttempt.AttemptStatus.GRADED);
        Double avgScore = attemptRepository.getAverageScoreByQuizId(quiz.getId());
        Double highScore = attemptRepository.getHighestScoreByQuizId(quiz.getId());
        
        return quizMapper.toSummaryResponse(quiz, totalAttempts, avgScore, highScore);
    }
}
