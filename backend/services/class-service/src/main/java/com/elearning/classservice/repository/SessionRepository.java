package com.elearning.classservice.repository;

import com.elearning.classservice.entity.Session;
import com.elearning.classservice.entity.enums.ScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
