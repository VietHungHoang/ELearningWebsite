package com.elearning.courseservice.service.impl;

import com.elearning.contentservice.config.S3Properties;
import com.elearning.courseservice.dto.request.CreateCourseRequest;
import com.elearning.courseservice.dto.response.CourseResponse;
import com.elearning.courseservice.enums.CourseLevel;
import com.elearning.courseservice.enums.CourseStatus;
import com.elearning.courseservice.exception.CourseNotFoundException;
import com.elearning.courseservice.exception.CourseTitleAlreadyExistsException;
import com.elearning.courseservice.mapper.CourseMapper;
import com.elearning.courseservice.model.Category;
import com.elearning.courseservice.model.Course;
import com.elearning.courseservice.repository.CategoryRepository;
import com.elearning.courseservice.repository.CourseRepository;
import com.elearning.courseservice.service.CourseService;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
    private final S3Properties s3Properties;
    
    private final CourseRepository courseRepository;
    
    private final CategoryRepository categoryRepository;

    @Override
    public CourseResponse createCourse(CreateCourseRequest request) {
        // Check if title already exists
        if (courseRepository.existsByTitle(request.getTitle())) {
            throw new CourseTitleAlreadyExistsException("Course title already exists: " + request.getTitle());
        }

        // Find category by ID
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new CourseNotFoundException("Category not found with id: " + request.getCategoryId()));

        Course course = CourseMapper.toEntity(request);
        course.setCategory(category);
        Course savedCourse = courseRepository.save(course);
        return CourseMapper.toResponse(savedCourse);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + id));
        return CourseMapper.toResponse(course);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseResponse> getAllCourses(Pageable pageable) {
        Page<Course> courses = courseRepository.findAll(pageable);
        return courses.map(CourseMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getCoursesByInstructor(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId)
                .stream()
                .map(CourseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getCoursesByStatus(CourseStatus status) {
        return courseRepository.findByStatus(status)
                .stream()
                .map(CourseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseResponse> getCoursesByCategory(Long categoryId, Pageable pageable) {
        Page<Course> courses = courseRepository.findByCategoryId(categoryId, pageable);
        return courses.map(CourseMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getCoursesByLevel(CourseLevel level) {
        return courseRepository.findByLevel(level)
                .stream()
                .map(CourseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseResponse> getFeaturedCourses(Pageable pageable) {
        Page<Course> courses = courseRepository.findByIsFeaturedTrue(pageable);
        return courses.map(CourseMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> searchCoursesByTitle(String keyword) {
        return courseRepository.findByTitleContaining(keyword)
                .stream()
                .map(CourseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseResponse> getCoursesWithFilters(Long categoryId, CourseLevel level,
                                                    CourseStatus status, BigDecimal minPrice,
                                                    BigDecimal maxPrice, Pageable pageable) {
        Page<Course> courses = courseRepository.findCoursesWithFilters(
            categoryId, level, status, minPrice, maxPrice, pageable);
        return courses.map(CourseMapper::toResponse);
    }

    @Override
    public CourseResponse updateCourse(Long id, CreateCourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + id));

        // Check title uniqueness if title is being changed
        if (!course.getTitle().equals(request.getTitle()) &&
            courseRepository.existsByTitle(request.getTitle())) {
            throw new CourseTitleAlreadyExistsException("Course title already exists: " + request.getTitle());
        }

        // Find category by ID if category is being changed
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new CourseNotFoundException("Category not found with id: " + request.getCategoryId()));

        Course updatedCourse = CourseMapper.updateEntity(course, request);
        updatedCourse.setCategory(category);
        Course savedCourse = courseRepository.save(updatedCourse);
        return CourseMapper.toResponse(savedCourse);
    }

    @Override
    public CourseResponse updateCourseStatus(Long id, CourseStatus status) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + id));

        course.setStatus(status);
        Course updatedCourse = courseRepository.save(course);
        return CourseMapper.toResponse(updatedCourse);
    }

    @Override
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new CourseNotFoundException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getMostEnrolledCourses(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return courseRepository.findMostEnrolledCourses(pageable)
                .stream()
                .map(CourseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getRecentCourses(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return courseRepository.findRecentCourses(pageable)
                .stream()
                .map(CourseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Long countCoursesByInstructor(Long instructorId) {
        return courseRepository.countByInstructorId(instructorId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countCoursesByStatus(CourseStatus status) {
        return courseRepository.countByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countCoursesByCategory(Long categoryId) {
        return courseRepository.countByCategoryId(categoryId);
    }
}
