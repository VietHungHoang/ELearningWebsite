package com.elearning.contentservice.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "lesson_progress")
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class LessonProgress extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long lessonId;
    
    @Column(nullable = false)
    private Long userId; // Reference to user from user-service
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isCompleted = false;
    
    @Column
    @Builder.Default
    private Integer progressPercentage = 0;
    
    @Column
    @Builder.Default
    private Integer timeSpentMinutes = 0;
    
    @Column(columnDefinition = "TEXT")
    private String notes; // User's notes for this lesson
}