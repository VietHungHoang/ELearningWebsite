package com.elearning.quiz.service;

import com.elearning.quiz.dto.QuizDto;
import com.elearning.quiz.dto.QuizQuestionDto;
import com.elearning.quiz.dto.GenerateQuestionsRequest;
import com.elearning.quiz.model.Quiz;
import com.elearning.quiz.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizService {
    
    @Autowired
    private QuizRepository quizRepository;
    
    @Autowired
    private QuizMapper quizMapper;
    
    @Autowired
    private AIQuestionGeneratorService aiQuestionGeneratorService;
    
    // Create quiz
    public QuizDto createQuiz(QuizDto quizDto) {
        Quiz quiz = quizMapper.toEntity(quizDto);
        Quiz savedQuiz = quizRepository.save(quiz);
        return quizMapper.toDto(savedQuiz);
    }
    
    // Get quiz by ID
    @Transactional(readOnly = true)
    public Optional<QuizDto> getQuizById(String id) {
        return quizRepository.findById(id)
                .map(quizMapper::toDto);
    }
    
    // Get quiz by section ID
    @Transactional(readOnly = true)
    public Optional<QuizDto> getQuizBySectionId(String sectionId) {
        return quizRepository.findBySectionIdAndIsActiveTrue(sectionId)
                .map(quizMapper::toDto);
    }
    
    // Get quizzes by tutor ID
    @Transactional(readOnly = true)
    public List<QuizDto> getQuizzesByTutorId(String tutorId) {
        return quizRepository.findByTutorIdAndIsActiveTrueOrderByCreatedAtDesc(tutorId)
                .stream()
                .map(quizMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Get quizzes by course ID
    @Transactional(readOnly = true)
    public List<QuizDto> getQuizzesByCourseId(String courseId) {
        return quizRepository.findByCourseIdAndIsActiveTrueOrderByCreatedAtDesc(courseId)
                .stream()
                .map(quizMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Update quiz
    public QuizDto updateQuiz(String id, QuizDto quizDto) {
        Quiz existingQuiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
        
        // Update fields
        existingQuiz.setTitle(quizDto.getTitle());
        existingQuiz.setDescription(quizDto.getDescription());
        existingQuiz.setPassingScore(quizDto.getPassingScore());
        existingQuiz.setTimeLimit(quizDto.getTimeLimit());
        existingQuiz.setIsActive(quizDto.getIsActive());
        
        Quiz updatedQuiz = quizRepository.save(existingQuiz);
        return quizMapper.toDto(updatedQuiz);
    }
    
    // Delete quiz (soft delete)
    public void deleteQuiz(String id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
        
        quiz.setIsActive(false);
        quizRepository.save(quiz);
    }
    
    // Search quizzes by title
    @Transactional(readOnly = true)
    public List<QuizDto> searchQuizzesByTitle(String title) {
        return quizRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(quizMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Get all active quizzes
    @Transactional(readOnly = true)
    public List<QuizDto> getAllActiveQuizzes() {
        return quizRepository.findByIsActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(quizMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Count quizzes by tutor
    @Transactional(readOnly = true)
    public Long countQuizzesByTutorId(String tutorId) {
        return quizRepository.countByTutorId(tutorId);
    }
    
    // Generate questions using AI
    public List<QuizQuestionDto> generateQuestions(String quizId, GenerateQuestionsRequest request) {
        // Verify quiz exists
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        
        // Generate questions using AI service
        List<QuizQuestionDto> generatedQuestions = aiQuestionGeneratorService.generateQuestions(request);
        
        // Set quiz ID for all generated questions
        generatedQuestions.forEach(question -> question.setQuizId(quizId));
        
        return generatedQuestions;
    }
}
