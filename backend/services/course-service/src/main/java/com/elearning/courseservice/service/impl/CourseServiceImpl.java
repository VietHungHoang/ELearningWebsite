package com.elearning.courseservice.service.impl;

import com.elearning.courseservice.dto.request.CreateDraftCourseRequest;
import com.elearning.courseservice.enums.CourseLevel;
import com.elearning.courseservice.exception.CategoryNotFoundException;
import com.elearning.courseservice.model.Category;
import com.elearning.courseservice.model.Course;
import com.elearning.courseservice.repository.CategoryRepository;
import com.elearning.courseservice.repository.CourseRepository;
import com.elearning.courseservice.service.CourseService;
import com.elearning.courseservice.utils.CourseUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    // private final CourseContentRepository courseContentRepository;
    // private final CoursePricingRepository coursePricingRepository;
    // private final CourseAnalyticsRepository courseAnalyticsRepository;

    @Override
    public Long createDraftCourse(CreateDraftCourseRequest request) {
        // Find category by ID
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + request.getCategoryId()));
        
        log.info("Creating draft course with category: {}", category.getName());

        // Convert level string to enum
        CourseLevel level = CourseUtils.convertLevelStringToEnum(request.getLevel());
        
        Course course = Course.builder()
                .title(request.getTitle())
                .category(category)
                .level(level)
                .instructorId(1L) // TODO: Get from authentication context
                .build();

        Course savedCourse = courseRepository.save(course);
        
        return savedCourse.getId();
    }
    
    // private void createDefaultCourseModules(Long courseId) {
    //     // Create default content
    //     CourseDetail content = CourseDetail.builder()
    //             .courseId(courseId)
    //             .description("")
    //             .build();
    //     courseContentRepository.save(content);
        
    //     // Create default pricing
    //     CoursePricing pricing = CoursePricing.builder()
    //             .courseId(courseId)
    //             .build();
    //     coursePricingRepository.save(pricing);
        
    //     // Create default analytics
    //     CourseAnalytics analytics = CourseAnalytics.builder()
    //             .courseId(courseId)
    //             .build();
    //     courseAnalyticsRepository.save(analytics);
    // }

    /*
     * ===== COMMENTED OUT METHODS - Will implement after content service completion =====
     *
     * @Override
     * public CourseResponse createCourse(CreateCourseRequest request) {
     *     // Check if title already exists
     *     if (courseRepository.existsByTitle(request.getTitle())) {
     *         throw new CourseTitleAlreadyExistsException("Course title already exists: " + request.getTitle());
     *     }
     *
     *     // Find category by ID
     *     Category category = categoryRepository.findById(request.getCategoryId())
     *             .orElseThrow(() -> new CourseNotFoundException("Category not found with id: " + request.getCategoryId()));
     *
     *     Course course = CourseMapper.toEntity(request);
     *     course.setCategory(category);
     *     Course savedCourse = courseRepository.save(course);
     *     return CourseMapper.toResponse(savedCourse);
     * }
     *
     * @Override
     * @Transactional(readOnly = true)
     * public CourseResponse getCourseById(Long id) {
     *     Course course = courseRepository.findById(id)
     *             .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + id));
     *     return CourseMapper.toResponse(course);
     * }
     *
     * @Override
     * @Transactional(readOnly = true)
     * public Page<CourseResponse> getAllCourses(Pageable pageable) {
     *     Page<Course> courses = courseRepository.findAll(pageable);
     *     return courses.map(CourseMapper::toResponse);
     * }
     *
     * @Override
     * @Transactional(readOnly = true)
     * public List<CourseResponse> getCoursesByInstructor(Long instructorId) {
     *     List<Course> courses = courseRepository.findByInstructorId(instructorId);
     *     return courses.stream()
     *             .map(CourseMapper::toResponse)
     *             .collect(Collectors.toList());
     * }
     *
     * @Override
     * @Transactional(readOnly = true)
     * public List<CourseResponse> getCoursesByStatus(CourseStatus status) {
     *     List<Course> courses = courseRepository.findByStatus(status);
     *     return courses.stream()
     *             .map(CourseMapper::toResponse)
     *             .collect(Collectors.toList());
     * }
     *
     * @Override
     * @Transactional(readOnly = true)
     * public Page<CourseResponse> getCoursesByCategory(Long categoryId, Pageable pageable) {
     *     Page<Course> courses = courseRepository.findByCategoryId(categoryId, pageable);
     *     return courses.map(CourseMapper::toResponse);
     * }
     *
     * @Override
     * @Transactional(readOnly = true)
     * public List<CourseResponse> getCoursesByLevel(CourseLevel level) {
     *     List<Course> courses = courseRepository.findByLevel(level);
     *     return courses.stream()
     *             .map(CourseMapper::toResponse)
     *             .collect(Collectors.toList());
     * }
     *
     * @Override
     * @Transactional(readOnly = true)
     * public Page<CourseResponse> getFeaturedCourses(Pageable pageable) {
     *     Page<Course> courses = courseRepository.findFeaturedCourses(pageable);
     *     return courses.map(CourseMapper::toResponse);
     * }
     *
     * @Override
     * @Transactional(readOnly = true)
     * public List<CourseResponse> searchCoursesByTitle(String keyword) {
     *     List<Course> courses = courseRepository.findByTitleContainingIgnoreCase(keyword);
     *     return courses.stream()
     *             .map(CourseMapper::toResponse)
     *             .collect(Collectors.toList());
     * }
     *
     * @Override
     * @Transactional(readOnly = true)
     * public Page<CourseResponse> getCoursesWithFilters(Long categoryId, CourseLevel level, 
     *                                                   CourseStatus status, BigDecimal minPrice, 
     *                                                   BigDecimal maxPrice, Pageable pageable) {
     *     Page<Course> courses = courseRepository.findCoursesWithFilters(categoryId, level, status, minPrice, maxPrice, pageable);
     *     return courses.map(CourseMapper::toResponse);
     * }
     *
     * @Override
     * public CourseResponse updateCourse(Long id, CreateCourseRequest request) {
     *     Course existingCourse = courseRepository.findById(id)
     *             .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + id));
     *
     *     // Check if new title already exists for another course
     *     if (!existingCourse.getTitle().equals(request.getTitle()) && 
     *         courseRepository.existsByTitle(request.getTitle())) {
     *         throw new CourseTitleAlreadyExistsException("Course title already exists: " + request.getTitle());
     *     }
     *
     *     // Find category if it's being updated
     *     Category category = categoryRepository.findById(request.getCategoryId())
     *             .orElseThrow(() -> new CourseNotFoundException("Category not found with id: " + request.getCategoryId()));
     *
     *     // Update course fields
     *     existingCourse.setTitle(request.getTitle());
     *     existingCourse.setCategory(category);
     *     existingCourse.setLevel(request.getLevel());
     *
     *     Course updatedCourse = courseRepository.save(existingCourse);
     *     return CourseMapper.toResponse(updatedCourse);
     * }
     *
     * @Override
     * public CourseResponse updateCourseStatus(Long id, CourseStatus status) {
     *     Course course = courseRepository.findById(id)
     *             .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + id));
     *
     *     course.setStatus(status);
     *     Course updatedCourse = courseRepository.save(course);
     *     return CourseMapper.toResponse(updatedCourse);
     * }
     *
     * @Override
     * public void deleteCourse(Long id) {
     *     if (!courseRepository.existsById(id)) {
     *         throw new CourseNotFoundException("Course not found with id: " + id);
     *     }
     *     courseRepository.deleteById(id);
     * }
     *
     * @Override
     * @Transactional(readOnly = true)
     * public List<CourseResponse> getMostEnrolledCourses(int limit) {
     *     Pageable pageable = PageRequest.of(0, limit);
     *     Page<Course> courses = courseRepository.findMostEnrolledCourses(pageable);
     *     return courses.getContent().stream()
     *             .map(CourseMapper::toResponse)
     *             .collect(Collectors.toList());
     * }
     *
     * @Override
     * @Transactional(readOnly = true)
     * public List<CourseResponse> getRecentCourses(int limit) {
     *     Pageable pageable = PageRequest.of(0, limit);
     *     Page<Course> courses = courseRepository.findRecentCourses(pageable);
     *     return courses.getContent().stream()
     *             .map(CourseMapper::toResponse)
     *             .collect(Collectors.toList());
     * }
     *
     * @Override
     * @Transactional(readOnly = true)
     * public Long countCoursesByInstructor(Long instructorId) {
     *     return courseRepository.countByInstructorId(instructorId);
     * }
     *
     * @Override
     * @Transactional(readOnly = true)
     * public Long countCoursesByStatus(CourseStatus status) {
     *     return courseRepository.countByStatus(status);
     * }
     *
     * @Override
     * @Transactional(readOnly = true)
     * public Long countCoursesByCategory(Long categoryId) {
     *     return courseRepository.countByCategoryId(categoryId);
     * }
     *
     * ===== END COMMENTED METHODS =====
     */
}