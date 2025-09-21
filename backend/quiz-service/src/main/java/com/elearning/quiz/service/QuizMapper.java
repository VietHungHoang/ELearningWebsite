package com.elearning.quiz.service;

import com.elearning.quiz.dto.*;
import com.elearning.quiz.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class QuizMapper {
    
    @Autowired
    private QuizQuestionMapper quizQuestionMapper;
    
    // Quiz mapping
    public QuizDto toDto(Quiz quiz) {
        QuizDto dto = new QuizDto();
        dto.setId(quiz.getId());
        dto.setSectionId(quiz.getSectionId());
        dto.setCourseId(quiz.getCourseId());
        dto.setTutorId(quiz.getTutorId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        dto.setPassingScore(quiz.getPassingScore());
        dto.setTimeLimit(quiz.getTimeLimit());
        dto.setIsActive(quiz.getIsActive());
        dto.setCreatedAt(quiz.getCreatedAt());
        dto.setUpdatedAt(quiz.getUpdatedAt());
        
        if (quiz.getQuestions() != null) {
            dto.setQuestions(quiz.getQuestions().stream()
                    .map(quizQuestionMapper::toDto)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    public Quiz toEntity(QuizDto dto) {
        Quiz quiz = new Quiz();
        quiz.setId(dto.getId());
        quiz.setSectionId(dto.getSectionId());
        quiz.setCourseId(dto.getCourseId());
        quiz.setTutorId(dto.getTutorId());
        quiz.setTitle(dto.getTitle());
        quiz.setDescription(dto.getDescription());
        quiz.setPassingScore(dto.getPassingScore());
        quiz.setTimeLimit(dto.getTimeLimit());
        quiz.setIsActive(dto.getIsActive());
        
        if (dto.getQuestions() != null) {
            quiz.setQuestions(dto.getQuestions().stream()
                    .map(quizQuestionMapper::toEntity)
                    .collect(Collectors.toList()));
        }
        
        return quiz;
    }
    
    // QuizQuestion mapping
    public QuizQuestionDto toDto(QuizQuestion question) {
        QuizQuestionDto dto = new QuizQuestionDto();
        dto.setId(question.getId());
        dto.setQuizId(question.getQuizId());
        dto.setQuestionText(question.getQuestionText());
        dto.setCorrectAnswer(question.getCorrectAnswer());
        dto.setOrder(question.getOrderIndex());
        dto.setCreatedAt(question.getCreatedAt());
        dto.setUpdatedAt(question.getUpdatedAt());
        
        if (question.getOptions() != null) {
            dto.setOptions(question.getOptions().stream()
                    .map(this::toDto)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    public QuizQuestion toEntity(QuizQuestionDto dto) {
        QuizQuestion question = new QuizQuestion();
        question.setId(dto.getId());
        question.setQuizId(dto.getQuizId());
        question.setQuestionText(dto.getQuestionText());
        question.setCorrectAnswer(dto.getCorrectAnswer());
        question.setOrderIndex(dto.getOrder());
        
        if (dto.getOptions() != null) {
            question.setOptions(dto.getOptions().stream()
                    .map(this::toEntity)
                    .collect(Collectors.toList()));
        }
        
        return question;
    }
    
    // QuizQuestionOption mapping
    public QuizQuestionOptionDto toDto(QuizQuestionOption option) {
        QuizQuestionOptionDto dto = new QuizQuestionOptionDto();
        dto.setId(option.getId());
        dto.setQuestionId(option.getQuestionId());
        dto.setText(option.getOptionText());
        dto.setIsCorrect(option.getIsCorrect());
        dto.setOrder(option.getOrderIndex());
        return dto;
    }
    
    public QuizQuestionOption toEntity(QuizQuestionOptionDto dto) {
        QuizQuestionOption option = new QuizQuestionOption();
        option.setId(dto.getId());
        option.setQuestionId(dto.getQuestionId());
        option.setOptionText(dto.getText());
        option.setIsCorrect(dto.getIsCorrect());
        option.setOrderIndex(dto.getOrder());
        return option;
    }
    
    // QuizAttempt mapping
    public QuizAttemptDto toDto(QuizAttempt attempt) {
        QuizAttemptDto dto = new QuizAttemptDto();
        dto.setId(attempt.getId());
        dto.setQuizId(attempt.getQuizId());
        dto.setSectionId(attempt.getSectionId());
        dto.setCourseId(attempt.getCourseId());
        dto.setStudentId(attempt.getStudentId());
        dto.setAnswers(attempt.getAnswers());
        dto.setCorrectAnswers(attempt.getCorrectAnswers());
        dto.setTotalQuestions(attempt.getTotalQuestions());
        dto.setPercentage(attempt.getPercentage());
        dto.setPassed(attempt.getPassed());
        dto.setTimeSpent(attempt.getTimeSpent());
        dto.setCompletedAt(attempt.getCompletedAt());
        dto.setCreatedAt(attempt.getCreatedAt());
        return dto;
    }
    
    public QuizAttempt toEntity(QuizAttemptDto dto) {
        QuizAttempt attempt = new QuizAttempt();
        attempt.setId(dto.getId());
        attempt.setQuizId(dto.getQuizId());
        attempt.setSectionId(dto.getSectionId());
        attempt.setCourseId(dto.getCourseId());
        attempt.setStudentId(dto.getStudentId());
        attempt.setAnswers(dto.getAnswers());
        attempt.setCorrectAnswers(dto.getCorrectAnswers());
        attempt.setTotalQuestions(dto.getTotalQuestions());
        attempt.setPercentage(dto.getPercentage());
        attempt.setPassed(dto.getPassed());
        attempt.setTimeSpent(dto.getTimeSpent());
        attempt.setCompletedAt(dto.getCompletedAt());
        return attempt;
    }
}
