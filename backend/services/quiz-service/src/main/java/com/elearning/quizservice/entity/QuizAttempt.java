package com.elearning.quizservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * QuizAttempt entity representing a student's attempt at a quiz
 */
@Entity
@Table(name = "quiz_attempts", indexes = {
    @Index(name = "idx_attempt_quiz_id", columnList = "quiz_id"),
    @Index(name = "idx_attempt_student_id", columnList = "student_id"),
    @Index(name = "idx_attempt_status", columnList = "status"),
    @Index(name = "idx_attempt_student_quiz", columnList = "student_id, quiz_id")
})
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true, exclude = {"quiz", "answers", "student"})
@ToString(exclude = {"quiz", "answers", "student"})
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttempt extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;
    
    @Column(name = "student_id", nullable = false)
    private UUID studentId;
    
    @Column(name = "attempt_number", nullable = false)
    private Integer attemptNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(name = "correct_answers")
    @Builder.Default
    private Integer correctAnswers = 0;
    
    @Column(name = "total_questions")
    private Integer totalQuestions;
    
    @Column
    private Double percentage;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean passed = false;
    
    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<StudentAnswer> answers = new ArrayList<>();
    
    /**
     * Student user info - for display purposes
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", insertable = false, updatable = false)
    private User student;
    
    public enum AttemptStatus {
        IN_PROGRESS,
        SUBMITTED,
        GRADED,
        ABANDONED
    }
    
    // Helper methods
    public void addAnswer(StudentAnswer answer) {
        answers.add(answer);
        answer.setAttempt(this);
    }
    
    public void removeAnswer(StudentAnswer answer) {
        answers.remove(answer);
        answer.setAttempt(null);
    }
    
    /**
     * Calculate time spent in seconds
     */
    public Integer getTimeSpentSeconds() {
        if (startedAt != null && submittedAt != null) {
            return (int) java.time.Duration.between(startedAt, submittedAt).getSeconds();
        }
        return null;
    }
    
    /**
     * Get count of answers
     */
    public Integer getAnswersCount() {
        return answers != null ? answers.size() : 0;
    }
}
