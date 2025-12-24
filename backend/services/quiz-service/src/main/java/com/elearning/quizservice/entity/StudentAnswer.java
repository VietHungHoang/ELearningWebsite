package com.elearning.quizservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * StudentAnswer entity representing a student's answer to a question
 */
@Entity
@Table(name = "student_answers", indexes = {
    @Index(name = "idx_answer_attempt_id", columnList = "attempt_id"),
    @Index(name = "idx_answer_question_id", columnList = "question_id"),
    @Index(name = "idx_answer_attempt_question", columnList = "attempt_id, question_id")
})
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true, exclude = {"attempt", "question"})
@ToString(exclude = {"attempt", "question"})
@NoArgsConstructor
@AllArgsConstructor
public class StudentAnswer extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private QuizAttempt attempt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    
    @Column(name = "selected_option_ids", columnDefinition = "TEXT")
    private String selectedOptionIds; // JSON array of UUIDs
    
    @Column(name = "is_correct", nullable = false)
    @Builder.Default
    private Boolean isCorrect = false;
    
    @Column(name = "answered_at")
    private LocalDateTime answeredAt;
}
