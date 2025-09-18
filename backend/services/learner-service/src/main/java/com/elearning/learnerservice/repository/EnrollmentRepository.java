package com.elearning.learnerservice.repository;

import com.elearning.learnerservice.enums.EnrollmentStatus;
import com.elearning.learnerservice.model.Enrollment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    // Find enrollments by learner
    List<Enrollment> findByLearnerIdAndStatus(Long learnerId, EnrollmentStatus status);
    Page<Enrollment> findByLearnerIdOrderByEnrolledAtDesc(Long learnerId, Pageable pageable);
    
    // Find enrollments by course
    List<Enrollment> findByCourseIdAndStatus(Long courseId, EnrollmentStatus status);
    Page<Enrollment> findByCourseIdOrderByEnrolledAtDesc(Long courseId, Pageable pageable);
    
    // Check if learner is enrolled
    Optional<Enrollment> findByLearnerIdAndCourseId(Long learnerId, Long courseId);
    boolean existsByLearnerIdAndCourseIdAndStatus(Long learnerId, Long courseId, EnrollmentStatus status);
    
    // Active enrollments
    List<Enrollment> findByLearnerIdAndStatusOrderByLastAccessedAtDesc(Long learnerId, EnrollmentStatus status);
    
    // Completed courses
    List<Enrollment> findByLearnerIdAndStatusOrderByCompletedAtDesc(Long learnerId, EnrollmentStatus status);
    
    // Statistics
    long countByLearnerIdAndStatus(Long learnerId, EnrollmentStatus status);
    long countByCourseIdAndStatus(Long courseId, EnrollmentStatus status);
    
    // Analytics queries
    @Query("SELECT e FROM Enrollment e WHERE e.status = :status AND e.lastAccessedAt < :cutoffDate")
    List<Enrollment> findInactiveEnrollments(@Param("status") EnrollmentStatus status, @Param("cutoffDate") LocalDateTime cutoffDate);
    
    @Query("SELECT e FROM Enrollment e WHERE e.enrolledAt BETWEEN :startDate AND :endDate ORDER BY e.enrolledAt DESC")
    List<Enrollment> findEnrollmentsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Course completion analytics
    @Query("SELECT AVG(e.completionPercentage) FROM Enrollment e WHERE e.courseId = :courseId AND e.status = :status")
    Double getAverageCompletionPercentageByCourse(@Param("courseId") Long courseId, @Param("status") EnrollmentStatus status);
    
    // Revenue analytics
    @Query("SELECT SUM(e.paidAmount) FROM Enrollment e WHERE e.courseId = :courseId AND e.status != 'CANCELLED'")
    Double getTotalRevenueByCourse(@Param("courseId") Long courseId);
    
    // Recent enrollments
    List<Enrollment> findTop10ByOrderByEnrolledAtDesc();
}
