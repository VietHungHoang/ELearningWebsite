package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.TutorReview;
import com.elearning.tutorservice.enums.ReviewModerationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TutorReviewRepository extends JpaRepository<TutorReview, UUID> {

    /**
     * Đếm số reviews mới của tutor trong khoảng thời gian
     */
    @Query("SELECT COUNT(tr) FROM TutorReview tr WHERE tr.tutor.id = :tutorId AND tr.createdAt BETWEEN :startDate AND :endDate")
    Long countNewReviewsByTutorAndDateRange(@Param("tutorId") UUID tutorId, @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Get all reviews by tutor ID and moderation status
     */
    List<TutorReview> findByTutorIdAndModerationStatus(UUID tutorId, ReviewModerationStatus status);

    /**
     * Get all APPROVED reviews for a tutor
     */
    List<TutorReview> findByTutorIdAndModerationStatusOrderByCreatedAtDesc(UUID tutorId, ReviewModerationStatus status);

    /**
     * Get all non-approved reviews for a specific student on a specific tutor
     */
    @Query("SELECT tr FROM TutorReview tr WHERE tr.tutor.id = :tutorId AND tr.studentId = :studentId AND tr.moderationStatus != 'APPROVED' ORDER BY tr.createdAt DESC")
    List<TutorReview> findNonApprovedByTutorIdAndStudentId(@Param("tutorId") UUID tutorId,
            @Param("studentId") UUID studentId);
}