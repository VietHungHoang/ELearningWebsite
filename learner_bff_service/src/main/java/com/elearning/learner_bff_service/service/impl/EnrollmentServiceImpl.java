package com.elearning.learner_bff_service.service.impl;

import com.elearning.learner_bff_service.client.LearnerServiceClient;
import com.elearning.learner_bff_service.dto.request.EnrollmentRequest;
import com.elearning.learner_bff_service.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final LearnerServiceClient learnerServiceClient;

    @Override
    public Map<String, Object> enrollCourse(EnrollmentRequest request) {
        log.info("BFF Service: Enrolling course for accountId: {}, courseId: {}", request.getAccountId(),
                request.getCourseId());
        return learnerServiceClient.enrollCourse(request);
    }

    @Override
    public List<Map<String, Object>> getEnrollments(Long accountId) {
        log.info("BFF Service: Getting enrollments for accountId: {}", accountId);
        return learnerServiceClient.getEnrollments(accountId);
    }

    @Override
    public Map<String, Object> getEnrollment(Long accountId, Long courseId) {
        log.info("BFF Service: Getting enrollment for accountId: {}, courseId: {}", accountId, courseId);
        return learnerServiceClient.getEnrollment(accountId, courseId);
    }

    @Override
    public Map<String, Object> startCourse(Long accountId, Long courseId) {
        log.info("BFF Service: Starting course for accountId: {}, courseId: {}", accountId, courseId);
        return learnerServiceClient.startCourse(accountId, courseId);
    }

    @Override
    public Map<String, Object> completeCourse(Long accountId, Long courseId) {
        log.info("BFF Service: Completing course for accountId: {}, courseId: {}", accountId, courseId);
        return learnerServiceClient.completeCourse(accountId, courseId);
    }
}
