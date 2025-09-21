package com.elearning.quiz.service;

import com.elearning.quiz.dto.QuizAttemptDto;
import com.elearning.quiz.model.QuizAttempt;
import com.elearning.quiz.repository.QuizAttemptRepository;
import com.elearning.quiz.repository.QuizQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizAttemptService {
    
    @Autowired
    private QuizAttemptRepository quizAttemptRepository;
    
    @Autowired
    private QuizQuestionRepository quizQuestionRepository;
    
    @Autowired
    private QuizMapper quizMapper;
    
    // Start a new quiz attempt
    public QuizAttemptDto startQuizAttempt(QuizAttemptDto attemptDto) {
        QuizAttempt attempt = quizMapper.toEntity(attemptDto);
        attempt.setCreatedAt(LocalDateTime.now());
        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);
        return quizMapper.toDto(savedAttempt);
    }
    
    // Get quiz attempt by ID
    @Transactional(readOnly = true)
    public Optional<QuizAttemptDto> getQuizAttemptById(String id) {
        return quizAttemptRepository.findById(id)
                .map(quizMapper::toDto);
    }
    
    // Get quiz attempts by student ID
    @Transactional(readOnly = true)
    public List<QuizAttemptDto> getQuizAttemptsByStudentId(String studentId) {
        return quizAttemptRepository.findByStudentIdOrderByCreatedAtDesc(studentId)
                .stream()
                .map(quizMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Get quiz attempts by quiz ID
    @Transactional(readOnly = true)
    public List<QuizAttemptDto> getQuizAttemptsByQuizId(String quizId) {
        return quizAttemptRepository.findByQuizIdOrderByCreatedAtDesc(quizId)
                .stream()
                .map(quizMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Get quiz attempts by student and quiz
    @Transactional(readOnly = true)
    public List<QuizAttemptDto> getQuizAttemptsByStudentAndQuiz(String studentId, String quizId) {
        return quizAttemptRepository.findByStudentIdAndQuizIdOrderByCreatedAtDesc(studentId, quizId)
                .stream()
                .map(quizMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Update quiz attempt answers
    public QuizAttemptDto updateQuizAttemptAnswers(String id, QuizAttemptDto attemptDto) {
        QuizAttempt existingAttempt = quizAttemptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz attempt not found with id: " + id));
        
        existingAttempt.setAnswers(attemptDto.getAnswers());
        existingAttempt.setTimeSpent(attemptDto.getTimeSpent());
        
        QuizAttempt updatedAttempt = quizAttemptRepository.save(existingAttempt);
        return quizMapper.toDto(updatedAttempt);
    }
    
    // Submit quiz attempt
    public QuizAttemptDto submitQuizAttempt(String id) {
        QuizAttempt attempt = quizAttemptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz attempt not found with id: " + id));
        
        // Calculate score
        calculateScore(attempt);
        
        // Mark as completed
        attempt.setCompletedAt(LocalDateTime.now());
        
        QuizAttempt submittedAttempt = quizAttemptRepository.save(attempt);
        return quizMapper.toDto(submittedAttempt);
    }
    
    // Get quiz attempts by course ID
    @Transactional(readOnly = true)
    public List<QuizAttemptDto> getQuizAttemptsByCourseId(String courseId) {
        return quizAttemptRepository.findByCourseIdOrderByCreatedAtDesc(courseId)
                .stream()
                .map(quizMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Get quiz attempts by section ID
    @Transactional(readOnly = true)
    public List<QuizAttemptDto> getQuizAttemptsBySectionId(String sectionId) {
        return quizAttemptRepository.findBySectionIdOrderByCreatedAtDesc(sectionId)
                .stream()
                .map(quizMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Calculate score for quiz attempt
    private void calculateScore(QuizAttempt attempt) {
        if (attempt.getAnswers() == null || attempt.getAnswers().isEmpty()) {
            attempt.setCorrectAnswers(0);
            attempt.setTotalQuestions(0);
            attempt.setPercentage(0.0);
            attempt.setPassed(false);
            return;
        }
        
        // Get quiz questions
        List<com.elearning.quiz.model.QuizQuestion> questions = 
                quizQuestionRepository.findByQuizIdOrderByOrderIndexAsc(attempt.getQuizId());
        
        int correctAnswers = 0;
        int totalQuestions = questions.size();
        
        // Check each answer
        for (com.elearning.quiz.model.QuizQuestion question : questions) {
            String userAnswer = attempt.getAnswers().get(question.getId());
            if (userAnswer != null && userAnswer.equals(question.getCorrectAnswer())) {
                correctAnswers++;
            }
        }
        
        // Calculate percentage
        double percentage = totalQuestions > 0 ? (double) correctAnswers / totalQuestions * 100 : 0.0;
        
        // Determine if passed (assuming 70% passing score - should get from quiz)
        boolean passed = percentage >= 70.0;
        
        attempt.setCorrectAnswers(correctAnswers);
        attempt.setTotalQuestions(totalQuestions);
        attempt.setPercentage(percentage);
        attempt.setPassed(passed);
    }
}
