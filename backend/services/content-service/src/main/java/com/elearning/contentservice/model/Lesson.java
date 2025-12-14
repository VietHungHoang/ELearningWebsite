package com.elearning.contentservice.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "lessons")
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Lesson extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long sectionId;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private Integer orderIndex;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LessonType type;
    
    @Column(columnDefinition = "TEXT")
    private String content; // For text-based lessons
    
    @Column
    private String videoUrl; // For video lessons
    
    @Column
    private String resourceUrl; // For downloadable resources
    
    @Column
    private Integer durationMinutes;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isFree = false;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    public enum LessonType {
        VIDEO,
        TEXT,
        QUIZ,
        ASSIGNMENT,
        RESOURCE
    }
}