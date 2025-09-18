package com.elearning.learnerservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "learner_wishlist")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerWishlist {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Student ID is required")
    @Column(nullable = false)
    private Long learnerId;
    
    @NotNull(message = "Course ID is required")
    @Column(nullable = false)
    private Long courseId;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime addedAt;
    
    // Analytics
    private String addedFrom; // WEB, MOBILE, RECOMMENDATION
    private Integer notificationsSent; // How many reminders sent
    private LocalDateTime lastNotificationAt;
    
    // Unique constraint to prevent duplicate wishlist entries
    @Column(unique = true, updatable = false)
    private String uniqueKey; // studentId + "_" + courseId
    
    @PrePersist
    private void generateUniqueKey() {
        this.uniqueKey = this.studentId + "_" + this.courseId;
    }
}
