package com.elearning.learnerservice.service;

import com.elearning.learnerservice.dto.response.ApiResponse;
import com.elearning.learnerservice.dto.request.CreateEnrollmentRequest;
import com.elearning.learnerservice.dto.response.EnrollmentResponse;
import com.elearning.learnerservice.model.Enrollment;
import com.elearning.learnerservice.enums.EnrollmentStatus;
import com.elearning.learnerservice.mapper.EnrollmentMapper;
import com.elearning.learnerservice.repository.EnrollmentRepository;
import com.elearning.learnerservice.repository.LearnerProgressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final LearnerProgressRepository learnerProgressRepository;

    /**
     * Enroll a learner in a course
     */
    public ApiResponse<EnrollmentResponse> enrollLearner(Long learnerId, CreateEnrollmentRequest request) {
        log.info("Processing enrollment for learner {} in course {}", learnerId, request.getCourseId());

        // Check if learner is already enrolled
        Optional<Enrollment> existingEnrollment = enrollmentRepository
                .findByLearnerIdAndCourseId(learnerId, request.getCourseId());

        if (existingEnrollment.isPresent()) {
            return ApiResponse.error(400, "Learner is already enrolled in this course", "Enrollment already exists");
        }

        try {
            // Create new enrollment
            Enrollment enrollment = Enrollment.builder()
                    .learnerId(learnerId)
                    .courseId(request.getCourseId())
                    .status(EnrollmentStatus.ACTIVE)
                    .paidAmount(request.getPaidAmount())
                    .paymentMethod(request.getPaymentMethod())
                    .transactionId(request.getTransactionId())
                    .enrolledAt(LocalDateTime.now())
                    .enrollmentSource(request.getEnrollmentSource())
                    .build();

            Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
            log.info("Successfully enrolled learner {} in course {}", learnerId, request.getCourseId());

            EnrollmentResponse response = EnrollmentMapper.toResponse(savedEnrollment);
            return ApiResponse.success(response, "Enrollment successful");

        } catch (Exception e) {
            log.error("Error enrolling learner {} in course {}: {}", 
                    learnerId, request.getCourseId(), e.getMessage());
            return ApiResponse.error(500, "Failed to process enrollment", e.getMessage());
        }
    }

    /**
     * Check if learner is enrolled in course
     */
    @Transactional(readOnly = true)
    public boolean isLearnerEnrolled(Long learnerId, Long courseId) {
        return enrollmentRepository.existsByLearnerIdAndCourseIdAndStatus(learnerId, courseId, EnrollmentStatus.ACTIVE);
    }

    /**
     * Update enrollment progress
     */
    public void updateEnrollmentProgress(Long learnerId, Long courseId) {
        Optional<Enrollment> enrollmentOpt = enrollmentRepository
                .findByLearnerIdAndCourseId(learnerId, courseId);
        
        if (enrollmentOpt.isEmpty()) {
            return;
        }

        Enrollment enrollment = enrollmentOpt.get();
        enrollment.setLastAccessedAt(LocalDateTime.now());
        enrollmentRepository.save(enrollment);
    }
}