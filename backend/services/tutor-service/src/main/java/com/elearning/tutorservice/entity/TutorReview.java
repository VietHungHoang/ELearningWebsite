package com.elearning.tutorservice.entity;

import com.elearning.tutorservice.enums.ReviewModerationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.util.UUID;

@Entity
@Table(name = "tutor_reviews", indexes = {
    @Index(name = "idx_tutor_reviews_tutor_id", columnList = "tutor_id"),
    @Index(name = "idx_tutor_reviews_student_id", columnList = "student_id"),
    @Index(name = "idx_tutor_reviews_status", columnList = "moderation_status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TutorReview extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tutor_id", nullable = false)
    private Tutor tutor;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "student_avatar_url")
    private String studentAvatarUrl;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(name = "moderation_status", nullable = false)
    @Builder.Default
    private ReviewModerationStatus moderationStatus = ReviewModerationStatus.PENDING;

    @Column(name = "violation_code")
    private Integer violationCode;

    @Column(name = "violation_reason")
    private String violationReason;

    @Column(name = "moderation_confidence")
    private Double moderationConfidence;
}