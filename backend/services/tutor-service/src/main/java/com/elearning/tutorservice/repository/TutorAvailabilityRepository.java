package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.TutorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TutorAvailabilityRepository extends JpaRepository<TutorAvailability, UUID> {
    
    /**
     * Find all availabilities for a tutor within a date range
     * Logic: effectiveStartDate <= endDate AND (effectiveEndDate >= startDate OR effectiveEndDate IS NULL)
     */
    @Query("SELECT a FROM TutorAvailability a WHERE a.tutor.id = :tutorId " +
           "AND a.effectiveStartDate <= :endDate " +
           "AND (a.effectiveEndDate >= :startDate OR a.effectiveEndDate IS NULL) " +
           "ORDER BY a.dayOfWeek, a.startTime")
    List<TutorAvailability> findByTutorIdAndDateRange(
            @Param("tutorId") UUID tutorId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
    
    /**
     * Find all availabilities for a tutor within a date range with status filter (legacy method)
     */
    @Query("SELECT a FROM TutorAvailability a WHERE a.tutor.id = :tutorId " +
           "AND a.effectiveStartDate <= :endDate " +
           "AND (a.effectiveEndDate >= :startDate OR a.effectiveEndDate IS NULL) " +
           "ORDER BY a.dayOfWeek, a.startTime")
    List<TutorAvailability> findByTutorIdAndDateRangeAndStatus(
            @Param("tutorId") UUID tutorId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("status") String status
    );
    
    /**
     * Find availabilities by IDs and tutor ID (for security check)
     */
    List<TutorAvailability> findByIdInAndTutorId(List<UUID> ids, UUID tutorId);
    
    /**
     * Delete availabilities for a tutor within a date range
     */
    void deleteByTutorIdAndEffectiveStartDateGreaterThanEqualAndEffectiveEndDateLessThanEqual(
            UUID tutorId, LocalDate startDate, LocalDate endDate);
}
