package com.elearning.quizservice.service.impl;

import com.elearning.quizservice.dto.response.QuizResultResponse;
import com.elearning.quizservice.dto.response.QuizStatisticsResponse;
import com.elearning.quizservice.entity.*;
import com.elearning.quizservice.exception.ResourceNotFoundException;
import com.elearning.quizservice.repository.*;
import com.elearning.quizservice.service.GradingService;
import com.elearning.quizservice.service.QuestionService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of GradingService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GradingServiceImpl implements GradingService {
    
    private final QuizAttemptRepository attemptRepository;
    private final StudentAnswerRepository answerRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuestionService questionService;
    private final ObjectMapper objectMapper;
    
    @Override
    @Transactional
    public QuizAttempt gradeAttempt(UUID attemptId) {
        log.info("Grading attempt: {}", attemptId);
        
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> ResourceNotFoundException.attempt(attemptId.toString()));
        
        // Calculate score
        calculateScore(attempt);
        
        // Update status
        attempt.setStatus(QuizAttempt.AttemptStatus.GRADED);
        
        attempt = attemptRepository.save(attempt);
        
        log.info("Graded attempt: {} - Correct: {}/{} ({}%)", 
                attemptId, attempt.getCorrectAnswers(), attempt.getTotalQuestions(), attempt.getPercentage());
        return attempt;
    }
    
    @Override
    @Transactional
    public void calculateScore(QuizAttempt attempt) {
        // Get all answers for this attempt
        List<StudentAnswer> answers = answerRepository.findByAttempt_Id(attempt.getId());
        
        // Get all questions for this quiz
        List<Question> questions = questionRepository.findByQuiz_IdAndIsActiveTrueOrderByOrderIndexAsc(
                attempt.getQuiz().getId());
        
        int totalQuestions = questions.size();
        int correctAnswers = 0;
        
        for (StudentAnswer answer : answers) {
            // Get selected option IDs
            List<UUID> selectedOptionIds = parseSelectedOptions(answer.getSelectedOptionIds());
            
            // Check if answer is correct
            boolean isCorrect = isAnswerCorrect(answer.getQuestion().getId(), selectedOptionIds);
            answer.setIsCorrect(isCorrect);
            
            if (isCorrect) {
                correctAnswers++;
            }
        }
        
        // Save updated answers
        answerRepository.saveAll(answers);
        
        // Update attempt with score
        attempt.setCorrectAnswers(correctAnswers);
        attempt.setTotalQuestions(totalQuestions);
        attempt.setPercentage(totalQuestions > 0 ? (correctAnswers * 100.0 / totalQuestions) : 0.0);
        
        // Check if passed
        attempt.setPassed(attempt.getPercentage() >= attempt.getQuiz().getPassingScore());
    }
    
    @Override
    public boolean isAnswerCorrect(UUID questionId, List<UUID> selectedOptionIds) {
        Question question = questionRepository.findByIdAndIsActiveTrue(questionId)
                .orElseThrow(() -> ResourceNotFoundException.question(questionId.toString()));
        
        // Get correct options
        List<QuestionOption> correctOptions = questionService.getCorrectOptions(questionId);
        Set<UUID> correctOptionIds = correctOptions.stream()
                .map(QuestionOption::getId)
                .collect(Collectors.toSet());
        
        // Check if answer is correct
        Set<UUID> selectedSet = new HashSet<>(selectedOptionIds);
        
        if (question.getType() == Question.QuestionType.SINGLE_CHOICE) {
            // For single choice, must select exactly one correct option
            return selectedSet.size() == 1 && correctOptionIds.containsAll(selectedSet);
        } else {
            // For multiple choice, must select all correct options and no incorrect ones
            return selectedSet.equals(correctOptionIds);
        }
    }
    
    @Override
    public Integer calculatePointsEarned(UUID questionId, List<UUID> selectedOptionIds) {
        // Not needed anymore, kept for compatibility
        return isAnswerCorrect(questionId, selectedOptionIds) ? 1 : 0;
    }
    
    @Override
    public QuizResultResponse buildQuizResult(UUID attemptId) {
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> ResourceNotFoundException.attempt(attemptId.toString()));
        
        Quiz quiz = attempt.getQuiz();
        
        List<StudentAnswer> studentAnswers = answerRepository.findByAttempt_Id(attemptId);
        List<Question> questions = questionService.getQuestionsByQuizId(quiz.getId());
        
        // Build question results
        List<QuizResultResponse.QuestionResultResponse> questionResults = questions.stream()
                .map(question -> {
                    // Find student's answer for this question
                    Optional<StudentAnswer> studentAnswer = studentAnswers.stream()
                            .filter(ans -> ans.getQuestion().getId().equals(question.getId()))
                            .findFirst();
                    
                    List<QuestionOption> options = questionService.getQuestionOptions(question.getId());
                    
                    Set<UUID> selectedOptionIds = studentAnswer
                            .map(ans -> new HashSet<>(parseSelectedOptions(ans.getSelectedOptionIds())))
                            .orElse(new HashSet<>());
                    
                    // Build option results
                    List<QuizResultResponse.OptionResultResponse> optionResults = options.stream()
                            .map(option -> QuizResultResponse.OptionResultResponse.builder()
                                    .optionId(option.getId())
                                    .optionText(option.getOptionText())
                                    .isCorrect(quiz.getShowCorrectAnswers() ? option.getIsCorrect() : null)
                                    .isSelected(selectedOptionIds.contains(option.getId()))
                                    .build())
                            .toList();
                    
                    return QuizResultResponse.QuestionResultResponse.builder()
                            .questionId(question.getId())
                            .questionText(question.getQuestionText())
                            .isCorrect(studentAnswer.map(StudentAnswer::getIsCorrect).orElse(false))
                            .options(optionResults)
                            .explanation(quiz.getShowCorrectAnswers() ? question.getExplanation() : null)
                            .build();
                })
                .toList();
        
        return QuizResultResponse.builder()
                .attemptId(attempt.getId())
                .quizId(quiz.getId())
                .quizTitle(quiz.getTitle())
                .correctAnswers(attempt.getCorrectAnswers())
                .totalQuestions(attempt.getTotalQuestions())
                .percentage(attempt.getPercentage())
                .passed(attempt.getPassed())
                .questions(questionResults)
                .build();
    }
    
    @Override
    public QuizStatisticsResponse getQuizStatistics(UUID quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> ResourceNotFoundException.quiz(quizId.toString()));
        
        List<QuizAttempt> attempts = attemptRepository.findByQuiz_IdOrderBySubmittedAtDesc(quizId);
        List<QuizAttempt> gradedAttempts = attempts.stream()
                .filter(a -> a.getStatus() == QuizAttempt.AttemptStatus.GRADED)
                .toList();
        
        // Calculate overall statistics
        Double avgPercentage = attemptRepository.getAverageScoreByQuizId(quizId);
        Double passRate = attemptRepository.getPassRateByQuizId(quizId);
        
        Integer avgTimeSpent = (int) Math.ceil(gradedAttempts.stream()
                .mapToInt(a -> a.getTimeSpentSeconds() != null ? a.getTimeSpentSeconds() : 0)
                .average()
                .orElse(0.0) / 60.0); // Convert seconds to minutes
        
        // Build question statistics
        List<Question> questions = questionService.getQuestionsByQuizId(quizId);
        List<QuizStatisticsResponse.QuestionStatistics> questionStats = questions.stream()
                .map(question -> buildQuestionStatistics(question))
                .toList();
        
        return QuizStatisticsResponse.builder()
                .quizId(quiz.getId())
                .quizTitle(quiz.getTitle())
                .totalAttempts((long) attempts.size())
                .completedAttempts((long) gradedAttempts.size())
                .averagePercentage(avgPercentage)
                .passRate(passRate)
                .averageTimeSpentMinutes(avgTimeSpent)
                .questionStatistics(questionStats)
                .build();
    }
    
    /**
     * Build statistics for a single question
     */
    private QuizStatisticsResponse.QuestionStatistics buildQuestionStatistics(Question question) {
        List<StudentAnswer> answers = answerRepository.findByQuestion_Id(question.getId());
        List<QuestionOption> options = questionService.getQuestionOptions(question.getId());
        
        long totalAnswers = answers.size();
        long correctAnswers = answers.stream().filter(StudentAnswer::getIsCorrect).count();
        double correctRate = totalAnswers > 0 ? (correctAnswers * 100.0 / totalAnswers) : 0.0;
        
        // Build option statistics
        Map<UUID, Long> optionSelectionCount = new HashMap<>();
        for (StudentAnswer answer : answers) {
            List<UUID> selectedIds = parseSelectedOptions(answer.getSelectedOptionIds());
            selectedIds.forEach(id -> optionSelectionCount.merge(id, 1L, Long::sum));
        }
        
        List<QuizStatisticsResponse.OptionStatistics> optionStats = options.stream()
                .map(option -> {
                    long selectedCount = optionSelectionCount.getOrDefault(option.getId(), 0L);
                    double selectedRate = totalAnswers > 0 ? (selectedCount * 100.0 / totalAnswers) : 0.0;
                    
                    return QuizStatisticsResponse.OptionStatistics.builder()
                            .optionId(option.getId())
                            .optionText(option.getOptionText())
                            .isCorrect(option.getIsCorrect())
                            .selectedCount(selectedCount)
                            .selectedRate(selectedRate)
                            .build();
                })
                .toList();
        
        return QuizStatisticsResponse.QuestionStatistics.builder()
                .questionId(question.getId())
                .questionText(question.getQuestionText())
                .orderIndex(question.getOrderIndex())
                .totalAnswers(totalAnswers)
                .correctAnswers(correctAnswers)
                .correctRate(correctRate)
                .optionStatistics(optionStats)
                .build();
    }
    
    /**
     * Parse selected option IDs from JSON string
     */
    private List<UUID> parseSelectedOptions(String selectedOptionIds) {
        try {
            return objectMapper.readValue(selectedOptionIds, new TypeReference<List<UUID>>() {});
        } catch (Exception e) {
            log.error("Error parsing selected options: {}", selectedOptionIds, e);
            return new ArrayList<>();
        }
    }
}
