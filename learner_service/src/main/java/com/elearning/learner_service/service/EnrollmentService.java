package com.elearning.learner_service.service;

import com.elearning.learner_service.dto.request.EnrollmentRequest;
import com.elearning.learner_service.dto.response.EnrollmentResponse;

import java.util.List;

public interface EnrollmentService {

    EnrollmentResponse enrollCourse(EnrollmentRequest request);

    List<EnrollmentResponse> getEnrollments(Long accountId);

    EnrollmentResponse getEnrollment(Long accountId, Long courseId);

    EnrollmentResponse startCourse(Long accountId, Long courseId);

    EnrollmentResponse completeCourse(Long accountId, Long courseId);
}
