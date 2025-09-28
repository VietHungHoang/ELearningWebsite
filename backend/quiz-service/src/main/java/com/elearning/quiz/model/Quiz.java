package com.elearning.quiz.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes")
public class Quiz {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank(message = "Section ID is required")
    @Column(name = "section_id", nullable = false)
    private String sectionId;
    
    @NotBlank(message = "Course ID is required")
    @Column(name = "course_id", nullable = false)
    private String courseId;
    
    @NotBlank(message = "Tutor ID is required")
    @Column(name = "tutor_id", nullable = false)
    private String tutorId;
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Min(value = 0, message = "Passing score must be at least 0")
    @Max(value = 100, message = "Passing score must not exceed 100")
    @Column(name = "passing_score", nullable = false)
    private Integer passingScore = 70;
    
    @Min(value = 1, message = "Time limit must be at least 1 minute")
    @Column(name = "time_limit")
    private Integer timeLimit;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("orderIndex ASC")
    private List<QuizQuestion> questions = new ArrayList<>();
    
    // Note: QuizAttempt relationship is handled via quizId field, not JPA mapping
    
    // Constructors
    public Quiz() {}
    
    public Quiz(String sectionId, String courseId, String tutorId, String title) {
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
    
    public List<QuizQuestion> getQuestions() {
        return questions;
    }
    
    public void setQuestions(List<QuizQuestion> questions) {
        this.questions = questions;
    }
    
    // Note: QuizAttempt methods removed - relationship handled via quizId field
}
