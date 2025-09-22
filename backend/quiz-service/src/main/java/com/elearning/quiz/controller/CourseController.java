package com.elearning.quiz.controller;

import com.elearning.quiz.dto.CourseDto;
import com.elearning.quiz.service.DatabaseCourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
