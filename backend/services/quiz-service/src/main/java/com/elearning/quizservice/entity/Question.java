package com.elearning.quizservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Question entity representing a quiz question
 */
@Entity
@Table(name = "questions", indexes = {
    @Index(name = "idx_question_quiz_id", columnList = "quiz_id"),
    @Index(name = "idx_question_order", columnList = "quiz_id, order_index")
})
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true, exclude = {"quiz", "options"})
@ToString(exclude = {"quiz", "options"})
@NoArgsConstructor
@AllArgsConstructor
public class Question extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;
    
    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QuestionType type;
    
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
    
    @Column(columnDefinition = "TEXT")
    private String explanation;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<QuestionOption> options = new ArrayList<>();
    
    public enum QuestionType {
        SINGLE_CHOICE,
        MULTIPLE_CHOICE
    }
    
    // Helper methods
    public void addOption(QuestionOption option) {
        options.add(option);
        option.setQuestion(this);
    }
    
    public void removeOption(QuestionOption option) {
        options.remove(option);
        option.setQuestion(null);
    }
}
