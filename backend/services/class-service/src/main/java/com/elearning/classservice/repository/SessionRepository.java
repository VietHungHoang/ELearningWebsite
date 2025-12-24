package com.elearning.classservice.repository;

import com.elearning.classservice.entity.Session;
import com.elearning.classservice.entity.enums.ScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
    List<Session> findByTutorIdAndStartTimeBetweenAndStatusIn(UUID tutorId, LocalDateTime startDate, LocalDateTime endDate, List<ScheduleStatus> statuses);
    
    /**
     * Count total sessions by tutor ID
     */
    long countByTutorId(UUID tutorId);

    /**
     * Find sessions by student ID (through class enrollment) and date range
     */
    @Query("SELECT s FROM Session s JOIN s.classEntity c JOIN ClassEnrollment e ON e.classEntity.id = c.id WHERE e.studentId = :studentId AND s.startTime BETWEEN :startDate AND :endDate")
    List<Session> findByStudentIdAndStartTimeBetween(@Param("studentId") UUID studentId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

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
}



