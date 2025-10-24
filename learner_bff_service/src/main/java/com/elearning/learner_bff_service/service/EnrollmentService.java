package com.elearning.learner_bff_service.service;

import com.elearning.learner_bff_service.dto.request.EnrollmentRequest;
import java.util.List;
import java.util.Map;

public interface EnrollmentService {
    Map<String, Object> enrollCourse(EnrollmentRequest request);

    List<Map<String, Object>> getEnrollments(Long accountId);

    Map<String, Object> getEnrollment(Long accountId, Long courseId);

    Map<String, Object> startCourse(Long accountId, Long courseId);

    Map<String, Object> completeCourse(Long accountId, Long courseId);
}
