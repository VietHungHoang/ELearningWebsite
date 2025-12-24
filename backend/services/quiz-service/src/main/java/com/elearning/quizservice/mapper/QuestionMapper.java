package com.elearning.quizservice.mapper;

import com.elearning.quizservice.dto.response.QuestionResponse;
import com.elearning.quizservice.entity.Question;
import com.elearning.quizservice.entity.QuestionOption;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for Question entity and DTOs
 */
@Component
public class QuestionMapper {
    
    /**
     * Map Question entity to QuestionResponse (with correct answers - for tutor)
     */
    public QuestionResponse toResponse(Question question, List<QuestionOption> options) {
        return QuestionResponse.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .type(question.getType())
                .orderIndex(question.getOrderIndex())
                .explanation(question.getExplanation())
                .options(mapOptions(options, true))
                .createdAt(question.getCreatedAt())
                .updatedAt(question.getUpdatedAt())
                .build();
    }
    
    /**
     * Map Question entity to QuestionResponse (without correct answers - for student)
     */
    public QuestionResponse toStudentResponse(Question question, List<QuestionOption> options) {
        return QuestionResponse.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .type(question.getType())
                .orderIndex(question.getOrderIndex())
                .options(mapOptions(options, false))
                .createdAt(question.getCreatedAt())
                .updatedAt(question.getUpdatedAt())
                .build();
    }
    
    /**
     * Map options to response DTOs
     */
    private List<QuestionResponse.QuestionOptionResponse> mapOptions(
            List<QuestionOption> options, boolean includeCorrectFlag) {
        return options.stream()
                .map(option -> QuestionResponse.QuestionOptionResponse.builder()
                        .id(option.getId())
                        .optionText(option.getOptionText())
                        .orderIndex(option.getOrderIndex())
                        .isCorrect(includeCorrectFlag ? option.getIsCorrect() : null)
                        .build())
                .collect(Collectors.toList());
    }
}
