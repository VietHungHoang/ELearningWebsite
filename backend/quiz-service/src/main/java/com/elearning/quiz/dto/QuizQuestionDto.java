package com.elearning.quiz.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

public class QuizQuestionDto {
    
    private String id;
    
    @NotBlank(message = "Quiz ID is required")
    private String quizId;
    
    @NotBlank(message = "Question text is required")
    private String questionText;
    
    @NotBlank(message = "Correct answer is required")
    @Size(max = 10, message = "Correct answer must not exceed 10 characters")
    private String correctAnswer;
    
    @Min(value = 1, message = "Order index must be at least 1")
    private Integer order;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private List<QuizQuestionOptionDto> options;
    
    // Constructors
    public QuizQuestionDto() {}
    
    public QuizQuestionDto(String quizId, String questionText, String correctAnswer, Integer order) {
        this.quizId = quizId;
        this.questionText = questionText;
        this.correctAnswer = correctAnswer;
        this.order = order;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getQuizId() {
        return quizId;
    }
    
    public void setQuizId(String quizId) {
        this.quizId = quizId;
    }
    
    public String getQuestionText() {
        return questionText;
    }
    
    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }
    
    public String getCorrectAnswer() {
        return correctAnswer;
    }
    
    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
    
    public Integer getOrder() {
        return order;
    }
    
    public void setOrder(Integer order) {
        this.order = order;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public List<QuizQuestionOptionDto> getOptions() {
        return options;
    }
    
    public void setOptions(List<QuizQuestionOptionDto> options) {
        this.options = options;
    }
}
