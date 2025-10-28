package com.elearning.apigateway.service;

import java.util.List;
import java.util.Map;

import com.elearning.apigateway.dto.request.EnrollmentRequest;

public interface EnrollmentService {
    Map<String, Object> enrollCourse(EnrollmentRequest request);

    List<Map<String, Object>> getEnrollments(Long accountId);

    Map<String, Object> getEnrollment(Long accountId, Long courseId);

    Map<String, Object> startCourse(Long accountId, Long courseId);

    Map<String, Object> completeCourse(Long accountId, Long courseId);
}

