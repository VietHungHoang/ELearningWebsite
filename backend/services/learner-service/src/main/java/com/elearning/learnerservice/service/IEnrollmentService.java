package com.elearning.learnerservice.service;

import com.elearning.learnerservice.dto.request.CreateEnrollmentRequest;
import com.elearning.learnerservice.dto.response.EnrollmentResponse;
import com.elearning.learnerservice.enums.EnrollmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IEnrollmentService {
    
    // Enrollment management
    EnrollmentResponse createEnrollment(CreateEnrollmentRequest request, Long studentId);
    EnrollmentResponse getEnrollmentById(Long id);
    EnrollmentResponse getEnrollmentByStudentAndCourse(Long studentId, Long courseId);
    
    // Student enrollments
    List<EnrollmentResponse> getStudentEnrollments(Long studentId, EnrollmentStatus status);
    Page<EnrollmentResponse> getStudentEnrollmentsPaginated(Long studentId, Pageable pageable);
    
    // Course enrollments
    List<EnrollmentResponse> getCourseEnrollments(Long courseId, EnrollmentStatus status);
    Page<EnrollmentResponse> getCourseEnrollmentsPaginated(Long courseId, Pageable pageable);
    
    // Enrollment status management
    EnrollmentResponse updateEnrollmentStatus(Long enrollmentId, EnrollmentStatus status);
    EnrollmentResponse cancelEnrollment(Long enrollmentId, String reason);
    EnrollmentResponse completeEnrollment(Long enrollmentId);
    
    // Access control
    boolean isStudentEnrolled(Long studentId, Long courseId);
    boolean canStudentAccessCourse(Long studentId, Long courseId);
    
    // Progress tracking
    EnrollmentResponse updateProgress(Long enrollmentId, int completedLessons, double completionPercentage);
    
    // Statistics
    long getEnrollmentCount(Long studentId, EnrollmentStatus status);
    long getCourseEnrollmentCount(Long courseId, EnrollmentStatus status);
    
    // Analytics
    List<EnrollmentResponse> getRecentEnrollments(int limit);
    Double getAverageCompletionRate(Long courseId);
    Double getTotalRevenue(Long courseId);
}
