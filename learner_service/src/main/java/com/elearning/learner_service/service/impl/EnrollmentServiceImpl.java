package com.elearning.learner_service.service.impl;

import com.elearning.learner_service.client.CourseServiceClient;
import com.elearning.learner_service.dto.request.EnrollmentRequest;
import com.elearning.learner_service.dto.response.EnrollmentResponse;
import com.elearning.learner_service.model.Enrollment;
import com.elearning.learner_service.repository.EnrollmentRepository;
import com.elearning.learner_service.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseServiceClient courseServiceClient;

    @Override
    public EnrollmentResponse enrollCourse(EnrollmentRequest request) {
        Enrollment existing = enrollmentRepository.findByAccountIdAndCourseId(
                request.getAccountId(), request.getCourseId());
        if (existing != null) {
            throw new RuntimeException("Học viên đã đăng ký khóa học này");
        }

        Enrollment enrollment = Enrollment.builder()
                .accountId(request.getAccountId())
                .courseId(request.getCourseId())
                .status("enrolled")
                .enrolledAt(Instant.now().toEpochMilli())
                .build();

        Enrollment saved = enrollmentRepository.save(enrollment);
        return mapToResponse(saved);
    }

    @Override
    public List<EnrollmentResponse> getEnrollments(Long accountId) {
        return enrollmentRepository.findByAccountId(accountId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EnrollmentResponse getEnrollment(Long accountId, Long courseId) {
        Enrollment enrollment = enrollmentRepository.findByAccountIdAndCourseId(accountId, courseId);
        if (enrollment == null) {
            throw new RuntimeException("Không tìm thấy enrollment");
        }
        return mapToResponse(enrollment);
    }

    @Override
    public EnrollmentResponse startCourse(Long accountId, Long courseId) {
        Enrollment enrollment = enrollmentRepository.findByAccountIdAndCourseId(accountId, courseId);
        if (enrollment == null || !enrollment.getStatus().equals("enrolled")) {
            throw new RuntimeException("Không thể bắt đầu khóa học");
        }
        enrollment.setStatus("active");
        enrollment.setStartedAt(Instant.now().toEpochMilli());
        enrollmentRepository.save(enrollment);
        return mapToResponse(enrollment);
    }

    @Override
    public EnrollmentResponse completeCourse(Long accountId, Long courseId) {
        Enrollment enrollment = enrollmentRepository.findByAccountIdAndCourseId(accountId, courseId);
        if (enrollment == null || !enrollment.getStatus().equals("active")) {
            throw new RuntimeException("Không thể hoàn thành khóa học");
        }
        enrollment.setStatus("complete");
        enrollment.setCompletedAt(Instant.now().toEpochMilli());
        enrollmentRepository.save(enrollment);
        return mapToResponse(enrollment);
    }

    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        EnrollmentResponse response = EnrollmentResponse.builder()
                .id(enrollment.getId())
                .accountId(enrollment.getAccountId())
                .courseId(enrollment.getCourseId())
                .status(enrollment.getStatus())
                .enrolledAt(enrollment.getEnrolledAt())
                .startedAt(enrollment.getStartedAt())
                .completedAt(enrollment.getCompletedAt())
                .build();

        // gọi course-service
        try {
            var courseInfo = courseServiceClient.getCourseInfo(enrollment.getCourseId());
            response.setCourseTitle((String) courseInfo.get("title"));
            response.setCourseThumbnail((String) courseInfo.get("thumbnail"));
            response.setCourseDescription((String) courseInfo.get("description"));
            response.setTotalStudents((Integer) courseInfo.getOrDefault("totalStudents", 0));
            response.setTotalLessons((Integer) courseInfo.getOrDefault("totalLessons", 0));
            response.setPrice((Double) courseInfo.getOrDefault("price", 0.0));
            response.setTotalReviews((Integer) courseInfo.getOrDefault("totalReviews", 0));
            response.setRating((Double) courseInfo.getOrDefault("rating", 0.0));
        } catch (Exception e) {
            // nếu course-service lỗi → trả enrollment với null/default fields
        }

        return response;
    }
}
