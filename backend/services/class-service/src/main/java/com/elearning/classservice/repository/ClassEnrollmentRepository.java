package com.elearning.classservice.repository;

import com.elearning.classservice.entity.ClassEnrollment;
import com.elearning.classservice.entity.enums.EnrollmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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
    @Query("SELECT ce FROM ClassEnrollment ce WHERE ce.classEntity.tutor.id = :tutorId AND ce.status = 'APPROVED'")
    List<ClassEnrollment> findByTutorId(@Param("tutorId") UUID tutorId);
    
    /**
     * Tìm tất cả students đã approved trong các lớp của tutor
     */
    @Query("SELECT DISTINCT ce.student.id FROM ClassEnrollment ce WHERE ce.classEntity.tutor.id = :tutorId AND ce.status = 'APPROVED'")
    List<UUID> findDistinctStudentIdsByTutorId(@Param("tutorId") UUID tutorId);
    
    /**
     * Get all enrollments for a class (no pagination)
     */
    List<ClassEnrollment> findByClassEntityId(UUID classId);

    /**
     * Find enrollments by student ID and status with pagination
     */
    Page<ClassEnrollment> findByStudentIdAndStatus(UUID studentId, EnrollmentStatus status, Pageable pageable);
    
    /**
     * Find enrollment for a specific student in tutor's classes
     */
    @Query("SELECT ce FROM ClassEnrollment ce WHERE ce.classEntity.tutor.id = :tutorId AND ce.student.id = :studentId")
    Optional<ClassEnrollment> findByTutorIdAndStudentId(@Param("tutorId") UUID tutorId, @Param("studentId") UUID studentId);

    /**
     * Đếm số học sinh duy nhất của tutor trong khoảng thời gian
     */
    @Query("SELECT COUNT(DISTINCT ce.student.id) FROM ClassEnrollment ce WHERE ce.classEntity.tutor.id = :tutorId AND ce.createdAt BETWEEN :startDate AND :endDate AND ce.status = 'APPROVED'")
    Long countDistinctStudentsByTutorIdAndDateRange(@Param("tutorId") UUID tutorId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Lấy thống kê số học sinh hàng tháng của tutor trong 12 tháng gần nhất
     */
    @Query("SELECT YEAR(ce.createdAt) as year, MONTH(ce.createdAt) as month, COUNT(DISTINCT ce.student.id) as students " +
           "FROM ClassEnrollment ce " +
           "WHERE ce.classEntity.tutor.id = :tutorId AND ce.status = 'APPROVED' AND ce.createdAt >= :startDate " +
           "GROUP BY YEAR(ce.createdAt), MONTH(ce.createdAt) " +
           "ORDER BY YEAR(ce.createdAt) DESC, MONTH(ce.createdAt) DESC")
    List<Object[]> getMonthlyStudentStats(@Param("tutorId") UUID tutorId, @Param("startDate") LocalDateTime startDate);
}
