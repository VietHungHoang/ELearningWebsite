package com.elearning.learnerservice.model;

import com.elearning.learnerservice.enums.EnrollmentStatus;
import jakarta.persistence.*;
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
@Table(name = "enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Student ID is required")
    @Column(nullable = false)
    private Long learnerId; // Reference to User Service
    
    @NotNull(message = "Course ID is required") 
    @Column(nullable = false)
    private Long courseId; // Reference to Course Service
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EnrollmentStatus status = EnrollmentStatus.ACTIVE;
    
    // Payment information
    @Column(precision = 10, scale = 2)
    private BigDecimal paidAmount;
    
    private String paymentMethod; // CREDIT_CARD, PAYPAL, BANK_TRANSFER, FREE
    private String transactionId; // Payment gateway transaction ID
    
    // Progress tracking
    @Builder.Default
    private Integer completedLessons = 0;
    
    @Builder.Default 
    private BigDecimal completionPercentage = BigDecimal.ZERO; // 0-100%
    
    // Timing
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime enrolledAt;
    
    private LocalDateTime completedAt; // When course was completed
    private LocalDateTime accessExpiresAt; // For limited time courses
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Certificate
    private String certificateUrl; // Generated certificate PDF
    private LocalDateTime certificateIssuedAt;
    
    // Analytics
    @Builder.Default
    private Integer totalWatchTimeMinutes = 0; // Total time spent watching videos
    
    private LocalDateTime lastAccessedAt; // Last time student accessed course
    
    // Audit
    private String enrollmentSource; // WEB, MOBILE, ADMIN, BULK_IMPORT
    private String notes; // Admin notes
}
