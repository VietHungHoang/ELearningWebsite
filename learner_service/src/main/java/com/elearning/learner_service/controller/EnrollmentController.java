package com.elearning.learner_service.controller;

import com.elearning.learner_service.dto.request.EnrollmentRequest;
import com.elearning.learner_service.dto.response.ApiResponse;
import com.elearning.learner_service.dto.response.EnrollmentResponse;
import com.elearning.learner_service.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/learners/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    public ApiResponse<EnrollmentResponse> enrollCourse(@RequestBody EnrollmentRequest request) {
        return ApiResponse.success(enrollmentService.enrollCourse(request), "Đăng ký khóa học thành công");
    }

    @GetMapping("/{accountId}")
    public ApiResponse<List<EnrollmentResponse>> getEnrollments(@PathVariable Long accountId) {
        return ApiResponse.success(enrollmentService.getEnrollments(accountId), "Lấy danh sách khóa học thành công");
    }

    @GetMapping("/{accountId}/{courseId}")
    public ApiResponse<EnrollmentResponse> getEnrollment(
            @PathVariable Long accountId,
            @PathVariable Long courseId) {
        return ApiResponse.success(enrollmentService.getEnrollment(accountId, courseId), "Lấy thông tin enrollment thành công");
    }

    @PostMapping("/{accountId}/{courseId}/start")
    public ApiResponse<EnrollmentResponse> startCourse(
            @PathVariable Long accountId,
            @PathVariable Long courseId) {
        return ApiResponse.success(enrollmentService.startCourse(accountId, courseId), "Khóa học đang học");
    }

    @PostMapping("/{accountId}/{courseId}/complete")
    public ApiResponse<EnrollmentResponse> completeCourse(
            @PathVariable Long accountId,
            @PathVariable Long courseId) {
        return ApiResponse.success(enrollmentService.completeCourse(accountId, courseId), "Hoàn thành khóa học");
    }
}
