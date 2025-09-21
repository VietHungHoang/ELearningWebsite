package com.elearning.quiz.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_question_options")
public class QuizQuestionOption {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank(message = "Question ID is required")
    @Column(name = "question_id", nullable = false)
    private String questionId;
    
    @NotBlank(message = "Option text is required")
    @Column(name = "option_text", columnDefinition = "TEXT", nullable = false)
    private String optionText;
    
    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect = false;
    
    @Min(value = 1, message = "Order index must be at least 1")
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", insertable = false, updatable = false)
    private QuizQuestion question;
    
    // Constructors
    public QuizQuestionOption() {}
    
    public QuizQuestionOption(String questionId, String optionText, Boolean isCorrect, Integer orderIndex) {
        this.questionId = questionId;
        this.optionText = optionText;
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
    
    public String getOptionText() {
        return optionText;
    }
    
    public void setOptionText(String optionText) {
        this.optionText = optionText;
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public QuizQuestion getQuestion() {
        return question;
    }
    
    public void setQuestion(QuizQuestion question) {
        this.question = question;
    }
}
