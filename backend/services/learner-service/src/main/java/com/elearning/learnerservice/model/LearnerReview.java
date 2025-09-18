package com.elearning.learnerservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "learner_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerReview {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Student ID is required")
    @Column(nullable = false)
    private Long learnerId;
    
    @NotNull(message = "Course ID is required")
    @Column(nullable = false)
    private Long courseId;
    
    @NotNull(message = "Rating is required")
    @DecimalMin(value = "1.0", message = "Rating must be between 1.0 and 5.0")
    @DecimalMax(value = "5.0", message = "Rating must be between 1.0 and 5.0")
    @Column(precision = 2, scale = 1, nullable = false)
    private BigDecimal rating; // 1.0 to 5.0
    
    @Size(max = 2000, message = "Review must not exceed 2000 characters")
    @Column(columnDefinition = "TEXT")
    private String reviewText;
    
    // Review metadata
    @Builder.Default
    private Boolean isVerifiedPurchase = false; // Did they actually enroll?
    
    @Builder.Default
    private Boolean isPublic = true; // Show publicly or private feedback
    
    @Builder.Default
    private Boolean isApproved = true; // Admin moderation
    
    // Helpfulness tracking
    @Builder.Default
    private Integer helpfulVotes = 0; // How many found this helpful
    
    @Builder.Default
    private Integer totalVotes = 0; // Total votes (helpful + not helpful)
    
    // Timestamps
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Moderation
    private String moderationNotes; // Admin notes
    private LocalDateTime moderatedAt;
    private Long moderatedBy; // Admin user ID
    
    // Analytics
    private String reviewSource; // WEB, MOBILE, EMAIL_PROMPT
    private Boolean wasPrompted; // Was this review prompted by system?
    
    // Response from instructor
    private String instructorResponse;
    private LocalDateTime instructorResponseAt;
    
    // Unique constraint to prevent multiple reviews
    @Column(unique = true, updatable = false)
    private String uniqueKey; // studentId + "_" + courseId
    
    @PrePersist
    private void generateUniqueKey() {
        this.uniqueKey = this.studentId + "_" + this.courseId;
    }
}
