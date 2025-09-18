package com.elearning.learnerservice.model;

import com.elearning.learnerservice.enums.ProgressStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "learner_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Student ID is required")
    @Column(nullable = false)
    private Long learnerId;
    
    @NotNull(message = "Course ID is required")
    @Column(nullable = false) 
    private Long courseId;
    
    // Content reference - either video or lesson
    private Long videoId; // Reference to Content Service
    private Long lessonId; // Reference to Course Service lesson
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProgressStatus status = ProgressStatus.NOT_STARTED;
    
    // Video progress specific
    private Integer watchTimeSeconds; // Time watched in seconds
    private Integer videoDurationSeconds; // Total video duration
    
    @DecimalMin(value = "0.0", message = "Watch percentage must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Watch percentage must be between 0 and 100")
    @Builder.Default
    private BigDecimal watchPercentage = BigDecimal.ZERO; // 0-100%
    
    // Completion tracking
    @Builder.Default
    private Boolean isCompleted = false;
    
    private LocalDateTime completedAt;
    private LocalDateTime firstWatchedAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime lastWatchedAt;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Analytics
    @Builder.Default
    private Integer watchCount = 0; // Number of times watched
    
    private Integer seekCount; // Number of times user seeked in video
    private String lastWatchPosition; // Last position watched (for resume)
    
    // Notes and bookmarks
    private String learnerNotes; // Personal notes from student
    private Boolean isBookmarked; // Student bookmarked this content
    
    // Completion criteria
    private BigDecimal requiredWatchPercentage; // Minimum % to consider complete (default 80%)
}
