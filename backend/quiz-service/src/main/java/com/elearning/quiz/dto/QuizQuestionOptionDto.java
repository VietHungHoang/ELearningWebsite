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
    private Integer orderIndex;
    
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
    
    // Constructors
    public QuizQuestionOptionDto() {}
    
    public QuizQuestionOptionDto(String questionId, String text, Boolean isCorrect, Integer orderIndex) {
        this.questionId = questionId;
        this.text = text;
        this.isCorrect = isCorrect;
        this.orderIndex = orderIndex;
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
    
    public Integer getOrderIndex() {
        return orderIndex;
    }
    
    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
    
    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public java.time.LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(java.time.LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = java.time.LocalDateTime.parse(createdAt);
    }
    
    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = java.time.LocalDateTime.parse(updatedAt);
    }
}
