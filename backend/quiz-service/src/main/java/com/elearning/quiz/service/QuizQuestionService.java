package com.elearning.quiz.service;

import com.elearning.quiz.dto.QuizQuestionDto;
import com.elearning.quiz.model.QuizQuestion;
import com.elearning.quiz.model.QuizQuestionOption;
import com.elearning.quiz.repository.QuizQuestionRepository;
import com.elearning.quiz.dto.QuizQuestionOptionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizQuestionService {
    
    @Autowired
    private QuizQuestionRepository quizQuestionRepository;
    
    @Autowired
    private QuizQuestionMapper quizQuestionMapper;
    
    // Create question
    public QuizQuestionDto createQuestion(QuizQuestionDto questionDto) {
        // Create question without options first
        QuizQuestion question = new QuizQuestion();
        question.setId(questionDto.getId());
        question.setQuizId(questionDto.getQuizId());
        question.setQuestionText(questionDto.getQuestionText());
        question.setCorrectAnswer(questionDto.getCorrectAnswer());
        question.setOrderIndex(questionDto.getOrder() != null ? questionDto.getOrder() : 1);
        
        // Save question first to get ID
        QuizQuestion savedQuestion = quizQuestionRepository.save(question);
        
        // Now create and save options with correct questionId
        if (questionDto.getOptions() != null && !questionDto.getOptions().isEmpty()) {
            for (QuizQuestionOptionDto optionDto : questionDto.getOptions()) {
                QuizQuestionOption option = new QuizQuestionOption();
                option.setId(optionDto.getId());
                option.setQuestionId(savedQuestion.getId()); // Set correct questionId
                option.setOptionText(optionDto.getText());
                option.setIsCorrect(optionDto.getIsCorrect() != null ? optionDto.getIsCorrect() : false);
                option.setOrderIndex(optionDto.getOrder() != null ? optionDto.getOrder() : 1);
                
                // Add to question's options list
                savedQuestion.getOptions().add(option);
            }
            // Save question with options
            savedQuestion = quizQuestionRepository.save(savedQuestion);
        }
        
        return quizQuestionMapper.toDto(savedQuestion);
    }
    
    // Get question by ID
    @Transactional(readOnly = true)
    public Optional<QuizQuestionDto> getQuestionById(String id) {
        return quizQuestionRepository.findById(id)
                .map(quizQuestionMapper::toDto);
    }
    
    // Get questions by quiz ID
    @Transactional(readOnly = true)
    public List<QuizQuestionDto> getQuestionsByQuizId(String quizId) {
        return quizQuestionRepository.findByQuizIdOrderByOrderIndexAsc(quizId)
                .stream()
                .map(quizQuestionMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Update question
    public QuizQuestionDto updateQuestion(QuizQuestionDto questionDto) {
        QuizQuestion existingQuestion = quizQuestionRepository.findById(questionDto.getId())
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionDto.getId()));
        
        // Update fields
        existingQuestion.setQuestionText(questionDto.getQuestionText());
        existingQuestion.setCorrectAnswer(questionDto.getCorrectAnswer());
        existingQuestion.setOrderIndex(questionDto.getOrder());
        
        QuizQuestion updatedQuestion = quizQuestionRepository.save(existingQuestion);
        return quizQuestionMapper.toDto(updatedQuestion);
    }
    
    // Delete question
    public void deleteQuestion(String id) {
        QuizQuestion question = quizQuestionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
        
        quizQuestionRepository.delete(question);
    }
    
    // Reorder questions
    public void reorderQuestions(List<QuizQuestionDto> questions) {
        for (QuizQuestionDto questionDto : questions) {
            QuizQuestion question = quizQuestionRepository.findById(questionDto.getId())
                    .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionDto.getId()));
            
            question.setOrderIndex(questionDto.getOrder());
            quizQuestionRepository.save(question);
        }
    }
}
