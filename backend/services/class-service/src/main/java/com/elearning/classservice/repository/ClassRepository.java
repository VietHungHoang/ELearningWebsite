package com.elearning.classservice.repository;

import com.elearning.classservice.entity.ClassEntity;
import com.elearning.classservice.entity.enums.ClassStatus;
import com.elearning.classservice.entity.enums.ClassType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClassRepository extends JpaRepository<ClassEntity, UUID> {
    Page<ClassEntity> findByTutorId(UUID tutorId, Pageable pageable);

    List<ClassEntity> findByTutorId(UUID tutorId);

    List<ClassEntity> findByStatus(ClassStatus status);

    Page<ClassEntity> findByStatus(ClassStatus status, Pageable pageable);

    Page<ClassEntity> findByClassType(ClassType classType, Pageable pageable);

    List<ClassEntity> findByTutorIdAndStatus(UUID tutorId, ClassStatus status);

    Page<ClassEntity> findByTutorIdAndStatus(UUID tutorId, ClassStatus status, Pageable pageable);

    List<ClassEntity> findByTutorIdAndMaxStudentsGreaterThan(UUID tutorId, Integer maxStudents);

    // Optimized queries with eager loading and sorted by createdAt DESC
    @EntityGraph(attributePaths = { "tutor", "schedules", "enrollments", "enrollments.student" })
    @Query("SELECT c FROM ClassEntity c WHERE c.tutor.id = :tutorId ORDER BY c.createdAt DESC")
    Page<ClassEntity> findByTutorIdWithDetailsOrderByCreatedAtDesc(@Param("tutorId") UUID tutorId, Pageable pageable);

    @EntityGraph(attributePaths = { "tutor", "schedules", "enrollments", "enrollments.student" })
    @Query("SELECT c FROM ClassEntity c WHERE c.tutor.id = :tutorId AND c.status = :status ORDER BY c.createdAt DESC")
    Page<ClassEntity> findByTutorIdAndStatusWithDetailsOrderByCreatedAtDesc(
            @Param("tutorId") UUID tutorId,
            @Param("status") ClassStatus status,
            Pageable pageable);
}
