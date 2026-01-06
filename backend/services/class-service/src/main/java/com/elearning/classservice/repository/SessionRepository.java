package com.elearning.classservice.repository;

import com.elearning.classservice.entity.Session;
import com.elearning.classservice.entity.enums.ScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {
        List<Session> findByClassEntityIdOrderByStartTimeAsc(UUID classId);

        List<Session> findByClassEntityIdAndStatus(UUID classId, ScheduleStatus status);

        List<Session> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);

        /**
         * Find booked sessions by tutor ID and date range
         */
        List<Session> findByTutorIdAndStartTimeBetween(UUID tutorId, LocalDateTime startDate, LocalDateTime endDate);

        /**
         * Find booked sessions by tutor ID, date range, and statuses
         */
        List<Session> findByTutorIdAndStartTimeBetweenAndStatusIn(UUID tutorId, LocalDateTime startDate,
                        LocalDateTime endDate, List<ScheduleStatus> statuses);

        /**
         * Count total sessions by tutor ID
         */
        long countByTutorId(UUID tutorId);

        /**
         * Find sessions by student ID (through class enrollments) and date range
         */
        @Query("SELECT s FROM Session s JOIN s.classEntity c JOIN c.enrollments e WHERE e.student.id = :studentId AND s.startTime BETWEEN :startDate AND :endDate")
        List<Session> findByStudentIdAndStartTimeBetween(@Param("studentId") UUID studentId,
                        @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

        /**
         * Count completed sessions by class ID
         */
        long countByClassEntityIdAndStatus(UUID classId, ScheduleStatus status);

        /**
         * Count total sessions by class ID
         */
        long countByClassEntityId(UUID classId);

        /**
         * Find sessions by tutor ID and start time greater than or equal
         */
        List<Session> findByTutorIdAndStartTimeGreaterThanEqual(UUID tutorId, LocalDateTime startTime);

        /**
         * Count completed sessions in date range (sessions that have ended and were
         * booked/accepted)
         */
        @Query("SELECT COUNT(s) FROM Session s WHERE s.endTime < :currentTime AND s.status IN ('BOOKED', 'ACCEPTED') AND DATE(s.startTime) BETWEEN :startDate AND :endDate")
        Long countCompletedSessionsInDateRange(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        @Param("currentTime") LocalDateTime currentTime);

        /**
         * Get daily completed sessions count
         */
        @Query("SELECT DATE(s.startTime) as date, COUNT(s) as count FROM Session s WHERE s.endTime < :currentTime AND s.status IN ('BOOKED', 'ACCEPTED') AND DATE(s.startTime) BETWEEN :startDate AND :endDate GROUP BY DATE(s.startTime) ORDER BY DATE(s.startTime)")
        List<Object[]> getDailyCompletedSessions(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate, @Param("currentTime") LocalDateTime currentTime);

        /**
         * Batch count sessions by class IDs - returns classId and total count
         */
        @Query("SELECT s.classEntity.id, COUNT(s) FROM Session s WHERE s.classEntity.id IN :classIds GROUP BY s.classEntity.id")
        List<Object[]> countSessionsByClassIds(@Param("classIds") List<UUID> classIds);

        /**
         * Batch count completed sessions by class IDs - returns classId and completed
         * count
         */
        @Query("SELECT s.classEntity.id, COUNT(s) FROM Session s WHERE s.classEntity.id IN :classIds AND s.status = :status GROUP BY s.classEntity.id")
        List<Object[]> countSessionsByClassIdsAndStatus(@Param("classIds") List<UUID> classIds,
                        @Param("status") ScheduleStatus status);

        /**
         * Find max session number for a class (to support adding more sessions)
         */
        @Query("SELECT COALESCE(MAX(s.sessionNumber), 0) FROM Session s WHERE s.classEntity.id = :classId")
        Integer findMaxSessionNumberByClassId(@Param("classId") UUID classId);
}
