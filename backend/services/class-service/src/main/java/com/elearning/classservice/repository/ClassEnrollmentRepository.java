package com.elearning.classservice.repository;

import com.elearning.classservice.entity.ClassEnrollment;
import com.elearning.classservice.entity.enums.EnrollmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassEnrollmentRepository extends JpaRepository<ClassEnrollment, UUID> {
    Page<ClassEnrollment> findByStudentId(UUID studentId, Pageable pageable);
    Page<ClassEnrollment> findByClassEntityId(UUID classId, Pageable pageable);
    List<ClassEnrollment> findByClassEntityIdAndStatus(UUID classId, EnrollmentStatus status);
    Optional<ClassEnrollment> findByClassEntityIdAndStudentId(UUID classId, UUID studentId);
    long countByClassEntityIdAndStatus(UUID classId, EnrollmentStatus status);
    
    /**
     * Lấy tất cả enrollments của các lớp do tutor này dạy
     */
    @Query("SELECT ce FROM ClassEnrollment ce WHERE ce.classEntity.tutorId = :tutorId AND ce.status = 'APPROVED'")
    List<ClassEnrollment> findByTutorId(@Param("tutorId") UUID tutorId);
    
    /**
     * Tìm tất cả students đã approved trong các lớp của tutor
     */
    @Query("SELECT DISTINCT ce.studentId FROM ClassEnrollment ce WHERE ce.classEntity.tutorId = :tutorId AND ce.status = 'APPROVED'")
    List<UUID> findDistinctStudentIdsByTutorId(@Param("tutorId") UUID tutorId);
    
    /**
     * Get all enrollments for a class (no pagination)
     */
    List<ClassEnrollment> findByClassEntityId(UUID classId);
    
    /**
     * Find enrollment for a specific student in tutor's classes
     */
    @Query("SELECT ce FROM ClassEnrollment ce WHERE ce.classEntity.tutorId = :tutorId AND ce.studentId = :studentId")
    Optional<ClassEnrollment> findByTutorIdAndStudentId(@Param("tutorId") UUID tutorId, @Param("studentId") UUID studentId);
}
