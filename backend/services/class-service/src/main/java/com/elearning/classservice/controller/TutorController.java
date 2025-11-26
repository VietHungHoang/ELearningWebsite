package com.elearning.classservice.controller;

import com.elearning.classservice.dto.response.TutorStudentResponse;
import com.elearning.classservice.dto.response.TutorStudentDetailResponse;
import com.elearning.classservice.dto.response.TutorClassResponse;
import com.elearning.classservice.dto.response.ClassDetailResponse;
import com.elearning.classservice.service.TutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tutors")
@RequiredArgsConstructor
public class TutorController {

    private final TutorService tutorService;

    /**
     * GET /api/v1/tutors/{tutorId}/students?page=0&size=10
     * <p>
     * Get the paginated list of all students of the tutor including status
     * @param tutorId ID of the tutor
     * @param page Page number (default: 0)
     * @param size Page size (default: 10)
     * @return Paginated list of students (ONE_ON_ONE, GROUP, TRIAL) in Spring Page format
     */
    @GetMapping("/{tutorId}/students")
    public ResponseEntity<Page<TutorStudentResponse>> getAllStudents(
            @PathVariable UUID tutorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<TutorStudentResponse> response = tutorService.getAllStudentsByTutorId(tutorId, page, size);
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/v1/tutors/{tutorId}/students/{studentId}
     * <p>
     * Get detailed information about a specific student
     * @param tutorId ID of the tutor
     * @param studentId ID of the student
     * @return Detailed student information with stats and sessions
     */
    @GetMapping("/{tutorId}/students/{studentId}")
    public ResponseEntity<TutorStudentDetailResponse> getStudentDetail(
            @PathVariable UUID tutorId,
            @PathVariable UUID studentId) {
        TutorStudentDetailResponse response = tutorService.getStudentDetail(tutorId, studentId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/v1/tutors/{tutorId}/classes?page=0&size=10
     * <p>
     * Get all classes of a tutor with pagination
     * @param tutorId ID of the tutor
     * @param page Page number (default: 0)
     * @param size Page size (default: 10)
     * @return Paginated list of classes with students, schedules, and materials
     */
    @GetMapping("/{tutorId}/classes")
    public ResponseEntity<Page<TutorClassResponse>> getClasses(
            @PathVariable UUID tutorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<TutorClassResponse> response = tutorService.getClasses(tutorId, page, size);
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/v1/tutors/{tutorId}/classes/{classId}
     * <p>
     * Get detailed information about a specific class
     * @param tutorId ID of the tutor
     * @param classId ID of the class
     * @return Detailed class information
     */
    @GetMapping("/{tutorId}/classes/{classId}")
    public ResponseEntity<ClassDetailResponse> getClassDetail(
            @PathVariable UUID tutorId,
            @PathVariable UUID classId) {
        ClassDetailResponse response = tutorService.getClassDetail(tutorId, classId);
        return ResponseEntity.ok(response);
    }
}
