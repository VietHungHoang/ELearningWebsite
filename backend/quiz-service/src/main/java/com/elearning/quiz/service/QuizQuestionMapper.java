package com.elearning.quiz.service;

import com.elearning.quiz.dto.QuizQuestionDto;
import com.elearning.quiz.dto.QuizQuestionOptionDto;
import com.elearning.quiz.model.QuizQuestion;
import com.elearning.quiz.model.QuizQuestionOption;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class QuizQuestionMapper {
    
    public QuizQuestionDto toDto(QuizQuestion question) {
        QuizQuestionDto dto = new QuizQuestionDto();
        dto.setId(question.getId());
        dto.setQuizId(question.getQuizId());
        dto.setQuestionText(question.getQuestionText());
        dto.setCorrectAnswer(question.getCorrectAnswer());
        dto.setOrder(question.getOrderIndex());
        dto.setCreatedAt(question.getCreatedAt());
        dto.setUpdatedAt(question.getUpdatedAt());
        
        // Map options
        if (question.getOptions() != null) {
            List<QuizQuestionOptionDto> optionDtos = question.getOptions().stream()
                    .map(this::toOptionDto)
                    .collect(Collectors.toList());
            dto.setOptions(optionDtos);
        }
        
        return dto;
    }
    
    public QuizQuestion toEntity(QuizQuestionDto dto) {
        QuizQuestion question = new QuizQuestion();
        question.setId(dto.getId());
        question.setQuizId(dto.getQuizId());
        question.setQuestionText(dto.getQuestionText());
        question.setCorrectAnswer(dto.getCorrectAnswer());
        question.setOrderIndex(dto.getOrder() != null ? dto.getOrder() : 1);
        
        // Map options - don't set questionId yet, will be set after question is saved
        if (dto.getOptions() != null) {
            List<QuizQuestionOption> options = dto.getOptions().stream()
                    .map(this::toOptionEntity)
                    .collect(Collectors.toList());
            question.setOptions(options);
        }
        
        return question;
    }
    
    private QuizQuestionOptionDto toOptionDto(QuizQuestionOption option) {
        QuizQuestionOptionDto dto = new QuizQuestionOptionDto();
        dto.setId(option.getId());
        dto.setQuestionId(option.getQuestionId());
        dto.setText(option.getOptionText());
        dto.setIsCorrect(option.getIsCorrect());
        dto.setOrderIndex(option.getOrderIndex());
        return dto;
    }
    
    private QuizQuestionOption toOptionEntity(QuizQuestionOptionDto dto) {
        QuizQuestionOption option = new QuizQuestionOption();
        option.setId(dto.getId());
        option.setQuestionId(dto.getQuestionId());
        option.setOptionText(dto.getText());
        option.setIsCorrect(dto.getIsCorrect() != null ? dto.getIsCorrect() : false);
        option.setOrderIndex(dto.getOrderIndex() != null ? dto.getOrderIndex() : 1);
        return option;
    }
}