package com.elearning.bffservice.controller;

import com.elearning.bffservice.dto.request.BulkUpdateAvailabilityRequest;
import com.elearning.bffservice.dto.tutor.request.GetTutorStudentsRequest;
import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.student.response.StudentResponse;
import com.elearning.bffservice.dto.response.StudentDetailResponse;
import com.elearning.bffservice.dto.response.ClassResponse;
import com.elearning.bffservice.dto.tutor.response.AvailabilityListResponse;
import com.elearning.bffservice.bff.tutors.response.TutorDetailBffResponse;
import com.elearning.bffservice.dto.request.UpdateTutorProfileRequest;
import com.elearning.bffservice.dto.event.TutorProfileUpdatedEvent;
import com.elearning.bffservice.service.KafkaProducerService;
import com.elearning.bffservice.service.TutorService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/v1/bff")
@RequiredArgsConstructor
public class TutorController {

    private final TutorService tutorService;
    private final KafkaProducerService kafkaProducerService;

    @GetMapping("/tutors/{tutorId}")
    public ResponseEntity<ApiResponse<TutorDetailBffResponse>> getTutorDetail(
            @PathVariable UUID tutorId,
            @RequestParam(required = false) UUID studentId,
            @RequestHeader(value = "X-User-Id", required = false) UUID userId) {
        // If studentId is null, use the user ID from header
        if (studentId == null) {
            studentId = userId;
        }
        TutorDetailBffResponse result = tutorService.getTutorDetail(tutorId, studentId);
        ApiResponse<TutorDetailBffResponse> response = ApiResponse.success(result, "Tutor detail retrieved successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("tutors/{tutorId}/students")
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> getTutorStudents(
            @PathVariable UUID tutorId,
            @ModelAttribute GetTutorStudentsRequest request) {

        Page<StudentResponse> result = tutorService.getTutorStudents(tutorId, request);
        ApiResponse<Page<StudentResponse>> response = ApiResponse.success(result, "Students retrieved successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Get detailed information about a specific student
     */
    @GetMapping("/{tutorId}/students/{studentId}/detail")
    public ResponseEntity<ApiResponse<StudentDetailResponse>> getStudentDetail(
            @PathVariable UUID tutorId,
            @PathVariable UUID studentId) {

        StudentDetailResponse result = tutorService.getStudentDetail(tutorId, studentId);
        ApiResponse<StudentDetailResponse> response = ApiResponse.success(result,
                "Student detail retrieved successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Get all classes of a tutor with pagination
     */
    @GetMapping("/{tutorId}/classes")
    public ResponseEntity<ApiResponse<Page<ClassResponse>>> getClasses(
            @PathVariable UUID tutorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        Page<ClassResponse> result = tutorService.getClasses(tutorId, page, limit);
        ApiResponse<Page<ClassResponse>> response = ApiResponse.success(result, "Classes retrieved successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/tutors/{tutorId}/availability
     * Get availability patterns for a tutor
     */
    @GetMapping("/{tutorId}/availability")
    public ResponseEntity<ApiResponse<AvailabilityListResponse>> getAvailabilities(
            @PathVariable UUID tutorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        AvailabilityListResponse availabilities = tutorService.getAvailabilities(tutorId, startDate, endDate);
        ApiResponse<AvailabilityListResponse> response = ApiResponse.success(availabilities,
                "Availability retrieved successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/tutors/{tutorId}/availability/bulk
     * Bulk update availability với 2 modes:
     * - "this_period": Chỉ ảnh hưởng trong khoảng startDate → endDate
     * - "recurring": Ảnh hưởng toàn bộ recurring pattern
     */
    @PostMapping("/{tutorId}/availability/bulk")
    public ResponseEntity<ApiResponse<Void>> bulkUpdateAvailability(
            @PathVariable UUID tutorId,
            @RequestBody BulkUpdateAvailabilityRequest request) {

        tutorService.bulkUpdateAvailability(tutorId, request);
        ApiResponse<Void> response = ApiResponse.success(null, "Availability updated successfully");
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }



}