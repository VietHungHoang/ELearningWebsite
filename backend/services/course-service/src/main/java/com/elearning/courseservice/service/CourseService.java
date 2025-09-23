package com.elearning.courseservice.service;

import com.elearning.courseservice.dto.request.CreateDraftCourseRequest;

public interface CourseService {

    /**
     * Create a draft course - Only active method
     */
    Long createDraftCourse(CreateDraftCourseRequest request);

    /*
     * ===== COMMENTED OUT METHODS - Will implement after content service completion =====
     * 
     * // Create a new course
     * CourseResponse createCourse(CreateCourseRequest request);
     * 
     * // Get course by ID
     * CourseResponse getCourseById(Long id);
     * 
     * // Get all courses with pagination
     * Page<CourseResponse> getAllCourses(Pageable pageable);
     * 
     * // Get courses by instructor ID
     * List<CourseResponse> getCoursesByInstructor(Long instructorId);
     * 
     * // Get courses by status
     * List<CourseResponse> getCoursesByStatus(CourseStatus status);
     * 
     * // Get courses by category ID
     * Page<CourseResponse> getCoursesByCategory(Long categoryId, Pageable pageable);
     * 
     * // Get courses by level
     * List<CourseResponse> getCoursesByLevel(CourseLevel level);
     * 
     * // Get featured courses
     * Page<CourseResponse> getFeaturedCourses(Pageable pageable);
     * 
     * // Search courses by title
     * List<CourseResponse> searchCoursesByTitle(String keyword);
     * 
     * // Get courses by filters
     * Page<CourseResponse> getCoursesWithFilters(Long categoryId, CourseLevel level, 
     *                                          CourseStatus status, BigDecimal minPrice, 
     *                                          BigDecimal maxPrice, Pageable pageable);
     * 
     * // Update course
     * CourseResponse updateCourse(Long id, CreateCourseRequest request);
     * 
     * // Update course status
     * CourseResponse updateCourseStatus(Long id, CourseStatus status);
     * 
     * // Delete course
     * void deleteCourse(Long id);
     * 
     * // Get most enrolled courses
     * List<CourseResponse> getMostEnrolledCourses(int limit);
     * 
     * // Get recent courses
     * List<CourseResponse> getRecentCourses(int limit);
     * 
     * // Count courses by instructor
     * Long countCoursesByInstructor(Long instructorId);
     * 
     * // Count courses by status
     * Long countCoursesByStatus(CourseStatus status);
     * 
     * // Count courses by category ID
     * Long countCoursesByCategory(Long categoryId);
     * 
     * ===== END COMMENTED METHODS =====
     */
}
