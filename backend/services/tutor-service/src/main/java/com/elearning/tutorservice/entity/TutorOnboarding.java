package com.elearning.tutorservice.entity;

import com.elearning.tutorservice.entity.enums.OnboardingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tutor_onboardings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorOnboarding {
    
    @Id
    private UUID tutorId;
    
    @Column(name = "current_step", nullable = false)
    @Builder.Default
    private Integer currentStep = 1;
    
    @Column(name = "json_data", columnDefinition = "TEXT")
    private String jsonData;

    @Column
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OnboardingStatus status = OnboardingStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
