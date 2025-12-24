package com.elearning.classservice.controller;

import com.elearning.classservice.dto.request.CreateClassRequest;
import com.elearning.classservice.dto.request.CreateClassBookingRequest;
import com.elearning.classservice.dto.response.ApiResponse;
import com.elearning.classservice.dto.response.ClassTableItem;
import com.elearning.classservice.dto.response.CreateClassBookingResponse;
import com.elearning.classservice.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    /**
     * GET /api/v1/classes/tutors/me?status={status}&page=0&size=10
     * <p>
     * Get class table for current tutor dashboard
     * @param tutorId Tutor ID from header
     * @param status Optional status filter
     * @param page Page number (default: 0)
     * @param size Page size (default: 10)
     * @return Paginated list of classes with student and schedule info
     */
    @GetMapping("/tutors/me")
    public ResponseEntity<ApiResponse<Page<ClassTableItem>>> getClassTable(
            @RequestHeader("X-User-Id") UUID tutorId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ClassTableItem> classTable = classService.getMyClass(tutorId, status, page, size);
        return ResponseEntity.ok(ApiResponse.success(classTable, "Classes retrieved successfully"));
    }

    /**
     * GET /api/v1/classes/students/me?status={status}&page=0&size=10
     * <p>
     * Get class table for current student dashboard
     * @param studentId Student ID from header
     * @param status Optional status filter
     * @param page Page number (default: 0)
     * @param size Page size (default: 10)
     * @return Paginated list of classes with tutor and schedule info
     */
    @GetMapping("/students/me")
    public ResponseEntity<ApiResponse<Page<ClassTableItem>>> getStudentClassTable(
            @RequestHeader("X-User-Id") UUID studentId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ClassTableItem> classTable = classService.getMyClassesAsStudent(studentId, status, page, size);
        return ResponseEntity.ok(ApiResponse.success(classTable, "Student classes retrieved successfully"));
    }

    /**
     * POST /api/v1/classes/tutors/me
     * <p>
     * Create a new class for current tutor
     * @param tutorId Tutor ID from header
     * @param request Create class request
     */
    @PostMapping("/tutors/me")
    public ResponseEntity<ApiResponse<Void>> createClass(
            @RequestHeader("X-User-Id") UUID tutorId,
            @RequestBody CreateClassRequest request) {
        classService.createClass(tutorId, request);
        return ResponseEntity.ok(ApiResponse.success(null, "Class created successfully"));
    }

    /**
     * POST /api/v1/classes/bookings
     * <p>
     * Create a class booking (class, enrollment, sessions)
     * @param request Create class booking request
     * @return Create class booking response with classId
     */
    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<CreateClassBookingResponse>> createClassBooking(
            @RequestBody CreateClassBookingRequest request) {
        CreateClassBookingResponse response = classService.createClassBooking(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Class booking created successfully"));
    }
}
