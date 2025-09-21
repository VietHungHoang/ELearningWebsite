package com.elearning.quiz.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

public class QuizDto {
    
    private String id;
    
    @NotBlank(message = "Section ID is required")
    private String sectionId;
    
    @NotBlank(message = "Course ID is required")
    private String courseId;
    
    @NotBlank(message = "Tutor ID is required")
    private String tutorId;
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;
    
    private String description;
    
    @Min(value = 0, message = "Passing score must be at least 0")
    @Max(value = 100, message = "Passing score must not exceed 100")
    private Integer passingScore = 70;
    
    @Min(value = 1, message = "Time limit must be at least 1 minute")
    private Integer timeLimit;
    
    private Boolean isActive = true;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private List<QuizQuestionDto> questions;
    
    // Constructors
    public QuizDto() {}
    
    public QuizDto(String sectionId, String courseId, String tutorId, String title) {
        this.sectionId = sectionId;
        this.courseId = courseId;
        this.tutorId = tutorId;
        this.title = title;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
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
    
    public String getTutorId() {
        return tutorId;
    }
    
    public void setTutorId(String tutorId) {
        this.tutorId = tutorId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getPassingScore() {
        return passingScore;
    }
    
    public void setPassingScore(Integer passingScore) {
        this.passingScore = passingScore;
    }
    
    public Integer getTimeLimit() {
        return timeLimit;
    }
    
    public void setTimeLimit(Integer timeLimit) {
        this.timeLimit = timeLimit;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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
    
    public List<QuizQuestionDto> getQuestions() {
        return questions;
    }
    
    public void setQuestions(List<QuizQuestionDto> questions) {
        this.questions = questions;
    }
}
