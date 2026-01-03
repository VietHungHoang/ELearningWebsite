package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.TutorOnboarding;
import com.elearning.tutorservice.entity.enums.OnboardingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TutorOnboardingRepository extends JpaRepository<TutorOnboarding, UUID> {

    long countByStatus(OnboardingStatus status);

    long countByStatusAndCreatedAtBetween(OnboardingStatus status, LocalDate startDate, LocalDate endDate);

    @Query("SELECT DATE(t.createdAt) as date, t.status, COUNT(t) " +
           "FROM TutorOnboarding t " +
           "WHERE DATE(t.createdAt) BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE(t.createdAt), t.status " +
           "ORDER BY DATE(t.createdAt)")
    List<Object[]> findWeeklyStats(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Count total new tutors (all statuses) in date range
     */
    @Query("SELECT COUNT(t) FROM TutorOnboarding t WHERE DATE(t.createdAt) BETWEEN :startDate AND :endDate")
    long countByCreatedAtBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Get daily new tutors count
     */
    @Query("SELECT DATE(t.createdAt) as date, COUNT(t) as count " +
           "FROM TutorOnboarding t " +
           "WHERE DATE(t.createdAt) BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE(t.createdAt) " +
           "ORDER BY DATE(t.createdAt)")
    List<Object[]> findDailyNewTutors(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Find all onboarding records by status with pagination
     */
    Page<TutorOnboarding> findByStatus(OnboardingStatus status, Pageable pageable);
}
