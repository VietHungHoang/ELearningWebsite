package com.elearning.apigateway.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import com.elearning.apigateway.dto.request.EnrollmentRequest;
import com.elearning.apigateway.dto.response.ApiResponse;
import com.elearning.apigateway.service.EnrollmentService;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/learners/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    public ApiResponse<Map<String, Object>> enrollCourse(@RequestBody EnrollmentRequest request) {
        return ApiResponse.success(enrollmentService.enrollCourse(request), "Đăng ký khóa học thành công");
    }

    @GetMapping("/{accountId}")
    public ApiResponse<List<Map<String, Object>>> getEnrollments(@PathVariable Long accountId) {
        return ApiResponse.success(enrollmentService.getEnrollments(accountId), "Lấy danh sách khóa học thành công");
    }

    @GetMapping("/{accountId}/{courseId}")
    public ApiResponse<Map<String, Object>> getEnrollment(
            @PathVariable Long accountId,
            @PathVariable Long courseId) {
        return ApiResponse.success(enrollmentService.getEnrollment(accountId, courseId),
                "Lấy thông tin enrollment thành công");
    }

    @PostMapping("/{accountId}/{courseId}/start")
    public ApiResponse<Map<String, Object>> startCourse(
            @PathVariable Long accountId,
            @PathVariable Long courseId) {
        return ApiResponse.success(enrollmentService.startCourse(accountId, courseId), "Khóa học đang học");
    }

    @PostMapping("/{accountId}/{courseId}/complete")
    public ApiResponse<Map<String, Object>> completeCourse(
            @PathVariable Long accountId,
            @PathVariable Long courseId) {
        return ApiResponse.success(enrollmentService.completeCourse(accountId, courseId), "Hoàn thành khóa học");
    }
}

