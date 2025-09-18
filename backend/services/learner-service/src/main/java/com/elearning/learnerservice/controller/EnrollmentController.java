package com.elearning.learnerservice.controller;

import com.elearning.learnerservice.dto.response.ApiResponse;
import com.elearning.learnerservice.dto.request.CreateEnrollmentRequest;
import com.elearning.learnerservice.dto.response.EnrollmentResponse;
import com.elearning.learnerservice.enums.EnrollmentStatus;
import com.elearning.learnerservice.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    /**
     * Enroll a student in a course
     */
    @PostMapping
    public ResponseEntity<ApiResponse<EnrollmentResponse>> enrollStudent(
            @Valid @RequestBody CreateEnrollmentRequest request) {
        
        log.info("Enrollment request received for student {} in course {}", 
                request.getStudentId(), request.getCourseId());
        
        ApiResponse<EnrollmentResponse> response = enrollmentService.enrollStudent(request);
        
        HttpStatus status = response.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(response, status);
    }

    /**
     * Get enrollment by ID
     */
    @GetMapping("/{enrollmentId}")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> getEnrollment(
            @PathVariable Long enrollmentId) {
        
        ApiResponse<EnrollmentResponse> response = enrollmentService.getEnrollment(enrollmentId);
        
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return new ResponseEntity<>(response, status);
    }

    /**
     * Get all enrollments for a student with pagination
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<Page<EnrollmentResponse>>> getStudentEnrollments(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        ApiResponse<Page<EnrollmentResponse>> response = enrollmentService.getStudentEnrollments(studentId, pageable);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get all enrollments for a course with pagination
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<Page<EnrollmentResponse>>> getCourseEnrollments(
            @PathVariable Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        ApiResponse<Page<EnrollmentResponse>> response = enrollmentService.getCourseEnrollments(courseId, pageable);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Update enrollment status
     */
    @PutMapping("/{enrollmentId}/status")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> updateEnrollmentStatus(
            @PathVariable Long enrollmentId,
            @RequestParam EnrollmentStatus status) {
        
        log.info("Updating enrollment {} status to {}", enrollmentId, status);
        
        ApiResponse<EnrollmentResponse> response = enrollmentService.updateEnrollmentStatus(enrollmentId, status);
        
        HttpStatus httpStatus = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(response, httpStatus);
    }

    /**
     * Cancel enrollment
     */
    @DeleteMapping("/{enrollmentId}")
    public ResponseEntity<ApiResponse<String>> cancelEnrollment(@PathVariable Long enrollmentId) {
        
        log.info("Cancellation request for enrollment {}", enrollmentId);
        
        ApiResponse<String> response = enrollmentService.cancelEnrollment(enrollmentId);
        
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(response, status);
    }

    /**
     * Check if student is enrolled in course
     */
    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkEnrollment(
            @RequestParam Long studentId,
            @RequestParam Long courseId) {
        
        boolean isEnrolled = enrollmentService.isStudentEnrolled(studentId, courseId);
        
        ApiResponse<Boolean> response = ApiResponse.success(
                "Enrollment status checked successfully", isEnrolled);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        ApiResponse<String> response = ApiResponse.success(
                "Enrollment service is healthy", "OK");
        return ResponseEntity.ok(response);
    }
}
