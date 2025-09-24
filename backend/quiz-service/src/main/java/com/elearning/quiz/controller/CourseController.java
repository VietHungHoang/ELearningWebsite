package com.elearning.quiz.controller;

import com.elearning.quiz.dto.CourseDto;
import com.elearning.quiz.service.DatabaseCourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@Tag(name = "Course Management", description = "APIs for managing courses")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CourseController {

    @Autowired
    private DatabaseCourseService courseService;

    @GetMapping
    @Operation(summary = "Get all courses")
    public ResponseEntity<List<CourseDto>> getAllCourses() {
        try {
            List<CourseDto> courses = courseService.getAllCourses();
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            System.err.println("❌ Error fetching courses: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get course by ID")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable String id) {
        try {
            CourseDto course = courseService.getCourseById(id);
            if (course != null) {
                return ResponseEntity.ok(course);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("❌ Error fetching course: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get course by slug")
    public ResponseEntity<CourseDto> getCourseBySlug(@PathVariable String slug) {
        try {
            CourseDto course = courseService.getCourseBySlug(slug);
            if (course != null) {
                return ResponseEntity.ok(course);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("❌ Error fetching course by slug: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get courses enrolled by student")
    public ResponseEntity<List<CourseDto>> getCoursesByStudentId(@PathVariable String studentId) {
        try {
            List<CourseDto> courses = courseService.getCoursesByStudentId(studentId);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            System.err.println("❌ Error fetching student courses: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/instructor/{instructorId}")
    @Operation(summary = "Get courses by instructor")
    public ResponseEntity<List<CourseDto>> getCoursesByInstructorId(@PathVariable String instructorId) {
        try {
            List<CourseDto> courses = courseService.getCoursesByInstructorId(instructorId);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            System.err.println("❌ Error fetching instructor courses: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Search courses by title or description")
    public ResponseEntity<List<CourseDto>> searchCourses(@RequestParam String query) {
        try {
            List<CourseDto> courses = courseService.searchCourses(query);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            System.err.println("❌ Error searching courses: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get courses by category")
    public ResponseEntity<List<CourseDto>> getCoursesByCategory(@PathVariable String category) {
        try {
            List<CourseDto> courses = courseService.getCoursesByCategory(category);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            System.err.println("❌ Error fetching courses by category: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/level/{level}")
    @Operation(summary = "Get courses by level")
    public ResponseEntity<List<CourseDto>> getCoursesByLevel(@PathVariable String level) {
        try {
            List<CourseDto> courses = courseService.getCoursesByLevel(level);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            System.err.println("❌ Error fetching courses by level: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{courseId}/final-test/complete")
    @Operation(summary = "Complete final test and generate certificate")
    public ResponseEntity<Map<String, Object>> completeFinalTest(
            @PathVariable String courseId,
            @RequestParam String studentId,
            @RequestParam int score) {
        try {
            System.out.println("🎯 Final test completed for course: " + courseId + ", student: " + studentId + ", score: " + score);
            
            // Check if score is passing (70% or higher)
            boolean passed = score >= 70;
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("passed", passed);
            response.put("score", score);
            response.put("message", passed ? "Congratulations! You passed the final test." : "You need to score at least 70% to pass.");
            
            if (passed) {
                // Generate certificate data
                Map<String, Object> certificate = new HashMap<>();
                certificate.put("certificateId", "CERT-" + System.currentTimeMillis());
                certificate.put("courseId", courseId);
                certificate.put("studentId", studentId);
                certificate.put("score", score);
                certificate.put("issuedAt", java.time.LocalDateTime.now().toString());
                certificate.put("status", "approved");
                certificate.put("downloadUrl", "https://platform.com/certificates/CERT-" + System.currentTimeMillis() + ".pdf");
                certificate.put("verificationUrl", "https://platform.com/verify/CERT-" + System.currentTimeMillis());
                
                response.put("certificate", certificate);
                System.out.println("✅ Certificate generated: " + certificate.get("certificateId"));
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error completing final test: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/lessons/{lessonId}/progress")
    @Operation(summary = "Update lesson progress")
    public ResponseEntity<Map<String, Object>> updateLessonProgress(
            @PathVariable String lessonId,
            @RequestBody Map<String, Object> progressData) {
        try {
            System.out.println("📝 Updating lesson progress for lesson: " + lessonId + ", data: " + progressData);
            
            // For now, just return success - in real implementation, this would update database
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Lesson progress updated successfully");
            response.put("lessonId", lessonId);
            response.put("isCompleted", progressData.get("isCompleted"));
            response.put("isCurrent", progressData.get("isCurrent"));
            response.put("isLocked", progressData.get("isLocked"));
            
            System.out.println("✅ Lesson progress updated: " + lessonId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error updating lesson progress: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
