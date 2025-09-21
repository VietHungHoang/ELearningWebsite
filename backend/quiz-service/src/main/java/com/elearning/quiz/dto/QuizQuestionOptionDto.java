package com.elearning.quiz.dto;

import jakarta.validation.constraints.*;

public class QuizQuestionOptionDto {
    
    private String id;
    
    @NotBlank(message = "Question ID is required")
    private String questionId;
    
    @NotBlank(message = "Option text is required")
    private String text;
    
    private Boolean isCorrect = false;
    
    @Min(value = 1, message = "Order index must be at least 1")
    private Integer order;
    
    // Constructors
    public QuizQuestionOptionDto() {}
    
    public QuizQuestionOptionDto(String questionId, String text, Boolean isCorrect, Integer order) {
        this.questionId = questionId;
        this.text = text;
        this.isCorrect = isCorrect;
        this.order = order;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getQuestionId() {
        return questionId;
    }
    
    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }
    
    public String getText() {
        return text;
    }
    
    public void setText(String text) {
        this.text = text;
    }
    
    public Boolean getIsCorrect() {
        return isCorrect;
    }
    
    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
    
    public Integer getOrder() {
        return order;
    }
    
    public void setOrder(Integer order) {
        this.order = order;
    }
}
