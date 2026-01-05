package com.elearning.quizservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Quiz entity representing a quiz/test
 */
@Entity
@Table(name = "quizzes", indexes = {
    @Index(name = "idx_quiz_class_id", columnList = "class_id"),
    @Index(name = "idx_quiz_creator_id", columnList = "creator_id"),
    @Index(name = "idx_quiz_status", columnList = "status")
})
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true, exclude = {"questions", "attempts", "creator", "classInfo"})
@ToString(exclude = {"questions", "attempts", "creator", "classInfo"})
@NoArgsConstructor
@AllArgsConstructor
public class Quiz extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    /**
     * Denormalized class info - for display purposes
     */
    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "class_id", nullable = false)
    private ClassInfo classInfo;
    
    @Column(name = "creator_id", nullable = false)
    private UUID creatorId;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "time_limit_minutes", nullable = false)
    private Integer timeLimitMinutes;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private QuizStatus status = QuizStatus.DRAFT;
    
    @Column(name = "published_at")
    private LocalDateTime publishedAt;
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @Column(name = "passing_score", nullable = false)
    @Builder.Default
    private Integer passingScore = 60;
    
    @Column(name = "shuffle_questions", nullable = false)
    @Builder.Default
    private Boolean shuffleQuestions = false;
    
    @Column(name = "show_correct_answers", nullable = false)
    @Builder.Default
    private Boolean showCorrectAnswers = true;
    
    @Column(name = "max_attempts", nullable = false)
    @Builder.Default
    private Integer maxAttempts = 1;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Question> questions = new ArrayList<>();
    
    @OneToMany(mappedBy = "quiz")
    @Builder.Default
    private List<QuizAttempt> attempts = new ArrayList<>();
    
    /**
     * Creator (Tutor) user info - for display purposes
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", insertable = false, updatable = false)
    private User creator;
    
    public enum QuizStatus {
        DRAFT,
        ACTIVE,
        ARCHIVED
    }
    
    // Helper methods
    public void addQuestion(Question question) {
        questions.add(question);
        question.setQuiz(this);
    }
    
    public void removeQuestion(Question question) {
        questions.remove(question);
        question.setQuiz(null);
    }

    public int getTotalQuestions() {
        return questions.size();
    }
    
    /**
     * Get classId from classInfo (for backward compatibility)
     */
    public UUID getClassId() {
        return classInfo != null ? classInfo.getId() : null;
    }
}
