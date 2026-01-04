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
public interface ClassScheduleRepository extends JpaRepository<com.elearning.classservice.entity.ClassSchedule, UUID> {
    List<com.elearning.classservice.entity.ClassSchedule> findByClassEntityId(UUID classId);
}
