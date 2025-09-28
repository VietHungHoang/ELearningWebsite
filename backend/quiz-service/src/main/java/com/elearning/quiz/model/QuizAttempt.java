package com.elearning.quiz.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "quiz_id", nullable = false)
    private String quizId;
    
    @Column(name = "section_id", nullable = false)
    private String sectionId;
    
    @Column(name = "course_id", nullable = false)
    private String courseId;
    
    @Column(name = "student_id", nullable = false)
    private String studentId;
    
    @Column(name = "score", nullable = false)
    private Integer score;
    
    @Column(name = "passed", nullable = false)
    private Boolean passed;
    
    @Column(name = "completed_at", nullable = false)
    private LocalDateTime completedAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "answers", columnDefinition = "TEXT")
    private String answers; // JSON string of answers
    
    @Transient
    private java.util.Map<String, String> answersMap; // For easier handling
    
    @Column(name = "correct_answers")
    private Integer correctAnswers;
    
    @Column(name = "total_questions")
    private Integer totalQuestions;
    
    @Column(name = "percentage")
    private Double percentage;
    
    @Column(name = "time_spent")
    private Integer timeSpent; // seconds
    
    // Note: Quiz relationship handled via quizId field, not JPA mapping
    
    // Constructors
    public QuizAttempt() {}
    
    public QuizAttempt(String quizId, String sectionId, String courseId, String studentId, 
                      Integer score, Boolean passed) {
        this.quizId = quizId;
        this.sectionId = sectionId;
        this.courseId = courseId;
        this.studentId = studentId;
        this.score = score;
        this.passed = passed;
        this.completedAt = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        
        // Set default values for other fields
        this.answers = "{}"; // Empty JSON object
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        this.percentage = 0.0;
        this.timeSpent = 0;
    }
    
    // Full constructor with all fields
    public QuizAttempt(String quizId, String sectionId, String courseId, String studentId, 
                      Integer score, Boolean passed, Integer correctAnswers, Integer totalQuestions, 
                      Double percentage, Integer timeSpent) {
        this.quizId = quizId;
        this.sectionId = sectionId;
        this.courseId = courseId;
        this.studentId = studentId;
        this.score = score;
        this.passed = passed;
        this.correctAnswers = correctAnswers;
        this.totalQuestions = totalQuestions;
        this.percentage = percentage;
        this.timeSpent = timeSpent;
        this.completedAt = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.answers = "{}"; // Empty JSON object
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getQuizId() { return quizId; }
    public void setQuizId(String quizId) { this.quizId = quizId; }
    
    public String getSectionId() { return sectionId; }
    public void setSectionId(String sectionId) { this.sectionId = sectionId; }
    
    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
    
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    
    public Boolean getPassed() { return passed; }
    public void setPassed(Boolean passed) { this.passed = passed; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getAnswers() { return answers; }
    public void setAnswers(String answers) { this.answers = answers; }
    
    public java.util.Map<String, String> getAnswersMap() { return answersMap; }
    public void setAnswersMap(java.util.Map<String, String> answersMap) { this.answersMap = answersMap; }
    
    public Integer getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(Integer correctAnswers) { this.correctAnswers = correctAnswers; }
    
    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
    
    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
    
    public Integer getTimeSpent() { return timeSpent; }
    public void setTimeSpent(Integer timeSpent) { this.timeSpent = timeSpent; }
    
    // Note: Quiz getter/setter removed - relationship handled via quizId field
}