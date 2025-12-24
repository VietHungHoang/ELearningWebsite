package com.elearning.quizservice.service.impl;

import com.elearning.quizservice.dto.request.SubmitAnswerRequest;
import com.elearning.quizservice.dto.request.SubmitQuizRequest;
import com.elearning.quizservice.dto.response.QuizAttemptResponse;
import com.elearning.quizservice.dto.response.QuizResultResponse;
import com.elearning.quizservice.entity.Quiz;
import com.elearning.quizservice.entity.QuizAttempt;
import com.elearning.quizservice.entity.StudentAnswer;
import com.elearning.quizservice.exception.InvalidOperationException;
import com.elearning.quizservice.exception.ResourceNotFoundException;
import com.elearning.quizservice.mapper.QuizMapper;
import com.elearning.quizservice.repository.QuizAttemptRepository;
import com.elearning.quizservice.repository.StudentAnswerRepository;
import com.elearning.quizservice.service.GradingService;
import com.elearning.quizservice.service.QuizAttemptService;
import com.elearning.quizservice.service.QuizService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Implementation of QuizAttemptService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class QuizAttemptServiceImpl implements QuizAttemptService {
    
    private final QuizAttemptRepository attemptRepository;
    private final StudentAnswerRepository answerRepository;
    private final QuizService quizService;
    private final GradingService gradingService;
    private final QuizMapper quizMapper;
    private final ObjectMapper objectMapper;
    
    @Override
    @Transactional
    public QuizAttemptResponse startQuizAttempt(UUID quizId, UUID studentId) {
        log.info("Starting quiz attempt for student: {} on quiz: {}", studentId, quizId);
        
        // Validate quiz access
        quizService.validateQuizAccess(quizId);
        
        // Check if student can attempt
        if (!canStudentAttemptQuiz(quizId, studentId)) {
            throw InvalidOperationException.maxAttemptsReached();
        }
        
        // Check for existing in-progress attempt
        Optional<QuizAttempt> existingAttempt = attemptRepository.findByStudentIdAndQuizIdAndStatus(
                studentId, quizId, QuizAttempt.AttemptStatus.IN_PROGRESS);
        
        if (existingAttempt.isPresent()) {
            log.info("Resuming existing attempt: {}", existingAttempt.get().getId());
            return quizMapper.toAttemptResponse(existingAttempt.get());
        }
        
        // Get attempt number
        Long attemptCount = getAttemptCount(quizId, studentId);
        
        // Create new attempt
        QuizAttempt attempt = QuizAttempt.builder()
                .quizId(quizId)
                .studentId(studentId)
                .attemptNumber(attemptCount.intValue() + 1)
                .status(QuizAttempt.AttemptStatus.IN_PROGRESS)
                .startedAt(LocalDateTime.now())
                .answersCount(0)
                .passed(false)
                .build();
        
        attempt = attemptRepository.save(attempt);
        
        log.info("Created quiz attempt: {}", attempt.getId());
        return quizMapper.toAttemptResponse(attempt);
    }
    
    @Override
    public QuizAttempt getAttemptById(UUID attemptId) {
        return attemptRepository.findById(attemptId)
                .orElseThrow(() -> ResourceNotFoundException.attempt(attemptId.toString()));
    }
    
    @Override
    public QuizAttemptResponse getCurrentAttempt(UUID quizId, UUID studentId) {
        QuizAttempt attempt = attemptRepository.findByStudentIdAndQuizIdAndStatus(
                studentId, quizId, QuizAttempt.AttemptStatus.IN_PROGRESS)
                .orElseThrow(() -> new ResourceNotFoundException("No in-progress attempt found"));
        
        return quizMapper.toAttemptResponse(attempt);
    }
    
    @Override
    @Transactional
    public void saveAnswer(UUID attemptId, SubmitAnswerRequest request) {
        log.info("Saving answer for attempt: {} question: {}", attemptId, request.getQuestionId());
        
        QuizAttempt attempt = getAttemptById(attemptId);
        
        // Validate attempt is in progress
        if (attempt.getStatus() != QuizAttempt.AttemptStatus.IN_PROGRESS) {
            throw InvalidOperationException.attemptNotInProgress();
        }
        
        // Convert option IDs to JSON
        String selectedOptionIdsJson;
        try {
            selectedOptionIdsJson = objectMapper.writeValueAsString(request.getSelectedOptionIds());
        } catch (Exception e) {
            log.error("Error serializing option IDs", e);
            throw new RuntimeException("Error saving answer", e);
        }
        
        // Check if answer already exists
        Optional<StudentAnswer> existingAnswer = answerRepository.findByAttemptIdAndQuestionId(
                attemptId, request.getQuestionId());
        
        if (existingAnswer.isPresent()) {
            // Update existing answer
            StudentAnswer answer = existingAnswer.get();
            answer.setSelectedOptionIds(selectedOptionIdsJson);
            answer.setAnsweredAt(LocalDateTime.now());
            answerRepository.save(answer);
            log.info("Updated existing answer");
        } else {
            // Create new answer
            StudentAnswer answer = StudentAnswer.builder()
                    .attemptId(attemptId)
                    .questionId(request.getQuestionId())
                    .selectedOptionIds(selectedOptionIdsJson)
                    .answeredAt(LocalDateTime.now())
                    .isCorrect(false)
                    .build();
            
            answerRepository.save(answer);
            
            // Update answers count
            attempt.setAnswersCount(attempt.getAnswersCount() + 1);
            attemptRepository.save(attempt);
            
            log.info("Created new answer");
        }
    }
    
    @Override
    @Transactional
    public QuizResultResponse submitQuizAttempt(UUID attemptId, UUID studentId, SubmitQuizRequest request) {
        log.info("Submitting quiz attempt: {}", attemptId);
        
        QuizAttempt attempt = getAttemptById(attemptId);
        
        // Validate ownership
        if (!attempt.getStudentId().equals(studentId)) {
            throw new ResourceNotFoundException("Attempt not found");
        }
        
        // Validate attempt is in progress
        if (attempt.getStatus() != QuizAttempt.AttemptStatus.IN_PROGRESS) {
            throw InvalidOperationException.attemptAlreadySubmitted();
        }
        
        // Save all answers from request
        if (request.getAnswers() != null) {
            for (SubmitAnswerRequest answerRequest : request.getAnswers()) {
                saveAnswer(attemptId, answerRequest);
            }
        }
        
        // Update attempt
        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setStatus(QuizAttempt.AttemptStatus.SUBMITTED);
        attemptRepository.save(attempt);
        
        // Grade the attempt
        gradingService.gradeAttempt(attemptId);
        
        // Return result
        return getQuizResult(attemptId, studentId);
    }
    
    @Override
    public QuizResultResponse getQuizResult(UUID attemptId, UUID studentId) {
        QuizAttempt attempt = getAttemptById(attemptId);
        
        // Validate ownership
        if (!attempt.getStudentId().equals(studentId)) {
            throw new ResourceNotFoundException("Attempt not found");
        }
        
        // Validate attempt is graded
        if (attempt.getStatus() != QuizAttempt.AttemptStatus.GRADED) {
            throw new InvalidOperationException("Attempt has not been graded yet");
        }
        
        return gradingService.buildQuizResult(attemptId);
    }
    
    @Override
    public List<QuizAttemptResponse> getAttemptsByQuiz(UUID quizId) {
        List<QuizAttempt> attempts = attemptRepository.findByQuizIdOrderBySubmittedAtDesc(quizId);
        return attempts.stream()
                .map(quizMapper::toAttemptResponse)
                .toList();
    }
    
    @Override
    public List<QuizAttemptResponse> getStudentAttemptHistory(UUID quizId, UUID studentId) {
        List<QuizAttempt> attempts = attemptRepository.findByStudentIdAndQuizIdOrderByAttemptNumberDesc(
                studentId, quizId);
        return attempts.stream()
                .map(quizMapper::toAttemptResponse)
                .toList();
    }
    
    @Override
    public List<QuizAttemptResponse> getAllStudentAttempts(UUID studentId) {
        List<QuizAttempt> attempts = attemptRepository.findByStudentIdOrderByStartedAtDesc(studentId);
        return attempts.stream()
                .map(quizMapper::toAttemptResponse)
                .toList();
    }
    
    @Override
    public boolean canStudentAttemptQuiz(UUID quizId, UUID studentId) {
        Quiz quiz = quizService.getQuizById(quizId);
        Long attemptCount = getAttemptCount(quizId, studentId);
        
        return attemptCount < quiz.getMaxAttempts();
    }
    
    @Override
    public Long getAttemptCount(UUID quizId, UUID studentId) {
        return attemptRepository.countByStudentIdAndQuizId(studentId, quizId);
    }
}
