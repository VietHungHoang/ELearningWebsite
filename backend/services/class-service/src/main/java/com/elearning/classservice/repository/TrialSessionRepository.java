package com.elearning.classservice.repository;

import com.elearning.classservice.entity.TrialSessionRequestEntity;
import com.elearning.classservice.entity.enums.ScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrialSessionRepository extends JpaRepository<TrialSessionRequestEntity, UUID> {

    boolean existsByTutorIdAndStudentId(UUID tutorId, UUID studentId);

    /**
     * Check if an active trial session exists (PENDING or ACCEPTED status)
     * Used to determine if student can book another trial
     */
    boolean existsByTutorIdAndStudentIdAndStatusIn(UUID tutorId, UUID studentId, List<ScheduleStatus> statuses);

    Optional<TrialSessionRequestEntity> findTopByTutorIdAndStudentIdOrderByCreatedAtDesc(UUID tutorId, UUID studentId);

    List<TrialSessionRequestEntity> findByTutorIdAndStatus(UUID tutorId, ScheduleStatus status);

    List<TrialSessionRequestEntity> findByStudentIdAndStatus(UUID studentId, ScheduleStatus status);

    List<TrialSessionRequestEntity> findByTutorId(UUID tutorId);

    List<TrialSessionRequestEntity> findByStudentId(UUID studentId);
}