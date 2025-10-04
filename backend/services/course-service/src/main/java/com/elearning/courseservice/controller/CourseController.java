package com.elearning.courseservice.controller;

import com.elearning.courseservice.dto.request.CreateDraftCourseRequest;
import com.elearning.courseservice.dto.response.ApiResponse;
import com.elearning.courseservice.dto.response.CourseBasicResponse;
import com.elearning.courseservice.services.CourseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CourseController {
    
    private final CourseService courseService;
    
    /**
     * Create course draft API - Only requires title, category, level
     * Used for initial course creation step
     */
    @PostMapping("/draft")
    public ResponseEntity<ApiResponse<Long>> createDraftCourse(@Valid @RequestBody CreateDraftCourseRequest request) {
        Long courseId = courseService.createDraftCourse(request);
        ApiResponse<Long> response = ApiResponse.success(HttpStatus.CREATED, courseId, "Draft course created successfully");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    /**
     * Get basic course information by ID
     */
    @GetMapping("/{courseId}/info")
    public ResponseEntity<ApiResponse<CourseBasicResponse>> getBasicCourseById(@PathVariable Long courseId) {
        CourseBasicResponse course = courseService.getBasicCourseById(courseId);
        ApiResponse<CourseBasicResponse> response = ApiResponse.success(course, "Basic course information retrieved successfully");
        return ResponseEntity.ok(response);
    }
    
    // ===== COMMENTED OUT APIs - Will implement after content service completion =====
    
    // @PostMapping
    // public ResponseEntity<ApiResponse<CourseResponse>> createCourse(@Valid @RequestBody CreateCourseRequest request) {
    //     CourseResponse course = courseService.createCourse(request);
    //     ApiResponse<CourseResponse> response = ApiResponse.success(201, course, "Course created successfully");
    //     return new ResponseEntity<>(response, HttpStatus.CREATED);
    // }
    
    // @GetMapping("/{id}")
    // public ResponseEntity<ApiResponse<CourseResponse>> getCourseById(@PathVariable Long id) {
    //     CourseResponse course = courseService.getCourseById(id);
    //     ApiResponse<CourseResponse> response = ApiResponse.success(course, "Course retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @GetMapping
    // public ResponseEntity<ApiResponse<Page<CourseResponse>>> getAllCourses(Pageable pageable) {
    //     Page<CourseResponse> courses = courseService.getAllCourses(pageable);
    //     ApiResponse<Page<CourseResponse>> response = ApiResponse.success(courses, "Courses retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @GetMapping("/instructor/{instructorId}")
    // public ResponseEntity<ApiResponse<List<CourseResponse>>> getCoursesByInstructor(@PathVariable Long instructorId) {
    //     List<CourseResponse> courses = courseService.getCoursesByInstructor(instructorId);
    //     ApiResponse<List<CourseResponse>> response = ApiResponse.success(courses, "Instructor courses retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @GetMapping("/status/{status}")
    // public ResponseEntity<ApiResponse<List<CourseResponse>>> getCoursesByStatus(@PathVariable CourseStatus status) {
    //     List<CourseResponse> courses = courseService.getCoursesByStatus(status);
    //     ApiResponse<List<CourseResponse>> response = ApiResponse.success(courses, "Courses by status retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @GetMapping("/category/{categoryId}")
    // public ResponseEntity<ApiResponse<Page<CourseResponse>>> getCoursesByCategory(
    //         @PathVariable Long categoryId, 
    //         Pageable pageable) {
    //     Page<CourseResponse> courses = courseService.getCoursesByCategory(categoryId, pageable);
    //     ApiResponse<Page<CourseResponse>> response = ApiResponse.success(courses, "Courses by category retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @GetMapping("/level/{level}")
    // public ResponseEntity<ApiResponse<List<CourseResponse>>> getCoursesByLevel(@PathVariable CourseLevel level) {
    //     List<CourseResponse> courses = courseService.getCoursesByLevel(level);
    //     ApiResponse<List<CourseResponse>> response = ApiResponse.success(courses, "Courses by level retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @GetMapping("/featured")
    // public ResponseEntity<ApiResponse<Page<CourseResponse>>> getFeaturedCourses(Pageable pageable) {
    //     Page<CourseResponse> courses = courseService.getFeaturedCourses(pageable);
    //     ApiResponse<Page<CourseResponse>> response = ApiResponse.success(courses, "Featured courses retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @GetMapping("/search")
    // public ResponseEntity<ApiResponse<List<CourseResponse>>> searchCourses(@RequestParam String keyword) {
    //     List<CourseResponse> courses = courseService.searchCoursesByTitle(keyword);
    //     ApiResponse<List<CourseResponse>> response = ApiResponse.success(courses, "Search results retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @GetMapping("/filter")
    // public ResponseEntity<ApiResponse<Page<CourseResponse>>> getCoursesWithFilters(
    //         @RequestParam(required = false) Long categoryId,
    //         @RequestParam(required = false) CourseLevel level,
    //         @RequestParam(required = false) CourseStatus status,
    //         @RequestParam(required = false) BigDecimal minPrice,
    //         @RequestParam(required = false) BigDecimal maxPrice,
    //         Pageable pageable) {
    //     Page<CourseResponse> courses = courseService.getCoursesWithFilters(categoryId, level, status, minPrice, maxPrice, pageable);
    //     ApiResponse<Page<CourseResponse>> response = ApiResponse.success(courses, "Filtered courses retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @PutMapping("/{id}")
    // public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
    //         @PathVariable Long id, 
    //         @Valid @RequestBody CreateCourseRequest request) {
    //     CourseResponse course = courseService.updateCourse(id, request);
    //     ApiResponse<CourseResponse> response = ApiResponse.success(course, "Course updated successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @PatchMapping("/{id}/status")
    // public ResponseEntity<ApiResponse<CourseResponse>> updateCourseStatus(
    //         @PathVariable Long id, 
    //         @RequestParam CourseStatus status) {
    //     CourseResponse course = courseService.updateCourseStatus(id, status);
    //     ApiResponse<CourseResponse> response = ApiResponse.success(course, "Course status updated successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @DeleteMapping("/{id}")
    // public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
    //     courseService.deleteCourse(id);
    //     ApiResponse<Void> response = ApiResponse.success(null, "Course deleted successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @GetMapping("/most-enrolled")
    // public ResponseEntity<ApiResponse<List<CourseResponse>>> getMostEnrolledCourses(
    //         @RequestParam(defaultValue = "10") int limit) {
    //     List<CourseResponse> courses = courseService.getMostEnrolledCourses(limit);
    //     ApiResponse<List<CourseResponse>> response = ApiResponse.success(courses, "Most enrolled courses retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @GetMapping("/recent")
    // public ResponseEntity<ApiResponse<List<CourseResponse>>> getRecentCourses(
    //         @RequestParam(defaultValue = "10") int limit) {
    //     List<CourseResponse> courses = courseService.getRecentCourses(limit);
    //     ApiResponse<List<CourseResponse>> response = ApiResponse.success(courses, "Recent courses retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @GetMapping("/count/instructor/{instructorId}")
    // public ResponseEntity<ApiResponse<Long>> countCoursesByInstructor(@PathVariable Long instructorId) {
    //     Long count = courseService.countCoursesByInstructor(instructorId);
    //     ApiResponse<Long> response = ApiResponse.success(count, "Course count by instructor retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @GetMapping("/count/status/{status}")
    // public ResponseEntity<ApiResponse<Long>> countCoursesByStatus(@PathVariable CourseStatus status) {
    //     Long count = courseService.countCoursesByStatus(status);
    //     ApiResponse<Long> response = ApiResponse.success(count, "Course count by status retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // @GetMapping("/count/category/{categoryId}")
    // public ResponseEntity<ApiResponse<Long>> countCoursesByCategory(@PathVariable Long categoryId) {
    //     Long count = courseService.countCoursesByCategory(categoryId);
    //     ApiResponse<Long> response = ApiResponse.success(count, "Course count by category retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    // ===== END COMMENTED APIs =====
}
