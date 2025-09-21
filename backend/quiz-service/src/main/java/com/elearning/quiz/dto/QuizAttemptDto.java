package com.elearning.quiz.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.Map;

public class QuizAttemptDto {
    
    private String id;
    
    @NotBlank(message = "Quiz ID is required")
    private String quizId;
    
    @NotBlank(message = "Section ID is required")
    private String sectionId;
    
    @NotBlank(message = "Course ID is required")
    private String courseId;
    
    @NotBlank(message = "Student ID is required")
    private String studentId;
    
    private Map<String, String> answers;
    
    @Min(value = 0, message = "Correct answers cannot be negative")
    private Integer correctAnswers = 0;
    
    @Min(value = 0, message = "Total questions cannot be negative")
    private Integer totalQuestions = 0;
    
    @DecimalMin(value = "0.0", message = "Percentage cannot be negative")
    @DecimalMax(value = "100.0", message = "Percentage cannot exceed 100")
    private Double percentage = 0.0;
    
    private Boolean passed = false;
    
    @Min(value = 0, message = "Time spent cannot be negative")
    private Integer timeSpent = 0;
    
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    
    // Constructors
    public QuizAttemptDto() {}
    
    public QuizAttemptDto(String quizId, String sectionId, String courseId, String studentId) {
        this.quizId = quizId;
        this.sectionId = sectionId;
        this.courseId = courseId;
        this.studentId = studentId;
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
    
    public String getSectionId() {
        return sectionId;
    }
    
    public void setSectionId(String sectionId) {
        this.sectionId = sectionId;
    }
    
    public String getCourseId() {
        return courseId;
    }
    
    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }
    
    public String getStudentId() {
        return studentId;
    }
    
    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
    
    public Map<String, String> getAnswers() {
        return answers;
    }
    
    public void setAnswers(Map<String, String> answers) {
        this.answers = answers;
    }
    
    public Integer getCorrectAnswers() {
        return correctAnswers;
    }
    
    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }
    
    public Integer getTotalQuestions() {
        return totalQuestions;
    }
    
    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }
    
    public Double getPercentage() {
        return percentage;
    }
    
    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
    
    public Boolean getPassed() {
        return passed;
    }
    
    public void setPassed(Boolean passed) {
        this.passed = passed;
    }
    
    public Integer getTimeSpent() {
        return timeSpent;
    }
    
    public void setTimeSpent(Integer timeSpent) {
        this.timeSpent = timeSpent;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
