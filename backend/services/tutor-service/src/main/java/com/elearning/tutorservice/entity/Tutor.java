package com.elearning.tutorservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "tutors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Tutor extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "is_verified", nullable = false)
    @Builder.Default
    private Boolean isVerified = false;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "specialization")
    private String specialization;

    @Column(name = "nationality_code", length = 2)
    private String nationalityCode;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "video_thumbnail_url")
    private String videoThumbnailUrl;

    @Column(name = "current_session_fee", precision = 10, scale = 2)
    private BigDecimal currentSessionFee;

    @Column(name = "previous_session_fee", precision = 10, scale = 2)
    private BigDecimal previousSessionFee;

    @Column(name = "session_duration_minutes")
    private Integer sessionDurationMinutes;

    @Column(length = 3)
    private String currency;

    @Column(name = "teaches_in_groups", nullable = false)
    @Builder.Default
    private Boolean teachesInGroups = false;

    @Column(name = "max_group_members")
    private Integer maxGroupMembers;
    
    @Column(name = "timezone_offset")
    private String timezoneOffset;

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
}