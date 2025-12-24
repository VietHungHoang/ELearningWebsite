package com.elearning.tutorservice.entity;

import com.elearning.tutorservice.entity.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tutors", indexes = {
    @Index(name = "idx_tutors_email", columnList = "email"),
    @Index(name = "idx_tutors_country_code", columnList = "country_code"),
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tutor {

    @Id
    private UUID id;

    @Column(name = "full_name")
    private String fullName;
    
    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "is_verified", nullable = false)
    @Builder.Default
    private Boolean isVerified = false;

    @Column(columnDefinition = "TEXT", name = "introduction")
    private String introduction;

    @Column(name = "headline")
    private String headline;

    @Column(name = "country_code")
    private String countryCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "timezone")
    private String timezone;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "current_session_fee", precision = 10, scale = 2)
    private BigDecimal currentSessionFee;

    @Column(name = "original_session_fee", precision = 10, scale = 2)
    private BigDecimal originalSessionFee;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "total_students")
    private Integer totalStudents;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Column(name = "payment_method_data")
    private String paymentMethodData;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    @OneToMany(mappedBy = "tutor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TutorLanguage> languages;

    @OneToMany(mappedBy = "tutor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TutorReview> reviews;

    @OneToMany(mappedBy = "tutor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TutorAvailability> availabilities;

    @OneToMany(mappedBy = "tutor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TutorSocial> socialLinks;

    @OneToMany(mappedBy = "tutor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TutorSubject> subjects;

    @OneToMany(mappedBy = "tutor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CareerEntry> careerEntries;

    @OneToMany(mappedBy = "tutor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Certification> certifications;


}