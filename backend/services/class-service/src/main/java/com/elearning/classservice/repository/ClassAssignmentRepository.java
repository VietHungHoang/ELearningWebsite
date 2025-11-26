package com.elearning.classservice.repository;

import com.elearning.classservice.entity.ClassAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClassAssignmentRepository extends JpaRepository<ClassAssignment, UUID> {
    List<ClassAssignment> findByClassEntityIdOrderByDueDateAsc(UUID classId);
}
