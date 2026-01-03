package com.elearning.classservice.repository;

import com.elearning.classservice.entity.RescheduleRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RescheduleRequestRepository extends JpaRepository<RescheduleRequest, UUID> {

    // Find requests made by a student
    List<RescheduleRequest> findByRequesterId(UUID requesterId);

    // Find requests for sessions where user is tutor
    @Query("SELECT r FROM RescheduleRequest r WHERE r.targetType = 'SESSION' AND r.session.tutor.id = :tutorId")
    List<RescheduleRequest> findBySessionTutorId(@Param("tutorId") UUID tutorId);

    // Find requests for classes where user is tutor
    @Query("SELECT r FROM RescheduleRequest r WHERE r.targetType = 'CLASS' AND r.classEntity.tutor.id = :tutorId")
    List<RescheduleRequest> findByClassTutorId(@Param("tutorId") UUID tutorId);
}
