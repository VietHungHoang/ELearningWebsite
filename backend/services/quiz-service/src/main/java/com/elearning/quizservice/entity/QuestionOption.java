package com.elearning.quizservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

/**
 * QuestionOption entity representing an answer option for a question
 */
@Entity
@Table(name = "question_options", indexes = {
    @Index(name = "idx_option_question_id", columnList = "question_id"),
    @Index(name = "idx_option_order", columnList = "question_id, order_index")
})
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true, exclude = "question")
@ToString(exclude = "question")
@NoArgsConstructor
@AllArgsConstructor
public class QuestionOption extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    
    @Column(name = "option_text", nullable = false, columnDefinition = "TEXT")
    private String optionText;
    
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
    
    @Column(name = "is_correct", nullable = false)
    @Builder.Default
    private Boolean isCorrect = false;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
