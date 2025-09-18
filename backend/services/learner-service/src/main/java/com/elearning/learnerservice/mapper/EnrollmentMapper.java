package com.elearning.learnerservice.mapper;

import com.elearning.learnerservice.dto.response.EnrollmentResponse;
import com.elearning.learnerservice.model.Enrollment;

public class EnrollmentMapper {

    public static EnrollmentResponse toResponse(Enrollment enrollment) {
        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .learnerId(enrollment.getLearnerId())
                .courseId(enrollment.getCourseId())
                .status(enrollment.getStatus())
                .paidAmount(enrollment.getPaidAmount())
                .paymentMethod(enrollment.getPaymentMethod())
                .transactionId(enrollment.getTransactionId())
                .completedLessons(enrollment.getCompletedLessons())
                .completionPercentage(enrollment.getCompletionPercentage())
                .enrolledAt(enrollment.getEnrolledAt())
                .completedAt(enrollment.getCompletedAt())
                .accessExpiresAt(enrollment.getAccessExpiresAt())
                .updatedAt(enrollment.getUpdatedAt())
                .certificateUrl(enrollment.getCertificateUrl())
                .certificateIssuedAt(enrollment.getCertificateIssuedAt())
                .totalWatchTimeMinutes(enrollment.getTotalWatchTimeMinutes())
                .lastAccessedAt(enrollment.getLastAccessedAt())
                .enrollmentSource(enrollment.getEnrollmentSource())
                .notes(enrollment.getNotes())
                .build();
    }
}
