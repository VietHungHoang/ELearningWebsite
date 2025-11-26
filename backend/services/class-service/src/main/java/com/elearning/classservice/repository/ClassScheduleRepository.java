package com.elearning.classservice.repository;

import com.elearning.classservice.entity.Session;
import com.elearning.classservice.entity.enums.ScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
@Deprecated
public interface ClassScheduleRepository extends JpaRepository<Session, UUID> {
    List<Session> findByClassEntityIdOrderByStartTimeAsc(UUID classId);
    List<Session> findByClassEntityIdAndStatus(UUID classId, ScheduleStatus status);
    List<Session> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
}
