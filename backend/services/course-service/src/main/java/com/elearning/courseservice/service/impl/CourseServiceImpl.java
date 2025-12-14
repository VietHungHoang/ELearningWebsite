package com.elearning.courseservice.service.impl;

import com.elearning.courseservice.dto.response.CourseResponse;
import com.elearning.courseservice.entity.Course;
import com.elearning.courseservice.repository.CourseRepository;
import com.elearning.courseservice.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    @Override
    public List<CourseResponse> getCoursesByTutorId(UUID tutorId) {
        List<Course> courses = courseRepository.findByTutorId(tutorId);
        return courses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CourseResponse mapToResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                // .description(course.getContent() != null ? course.getContent().getDescription() : null)
                // .shortDescription(course.getContent() != null ? course.getContent().getShortDescription() : null)
                .tutorId(course.getTutorId())
                .status(course.getStatus())
                .level(course.getLevel())
                .price(course.getPrice())
                .oldPrice(course.getOldPrice())
                // .discountPrice(course.getPricing() != null ? course.getPricing().getDiscountPrice() : null)
                // .thumbnailUrl(course.getContent() != null ? course.getContent().getThumbnailUrl() : null)
                // .durationMinutes(course.getAnalytics() != null ? course.getAnalytics().getTotalDurationMinutes() : null)
                // .enrolledCount(course.getAnalytics() != null ? course.getAnalytics().getEnrolledCount() : null)
                // .averageRating(course.getAnalytics() != null ? course.getAnalytics().getAverageRating() : null)
                // .ratingCount(course.getAnalytics() != null ? course.getAnalytics().getRatingCount() : null)
                // .requirements(course.getContent() != null ? course.getContent().getRequirements() : null)
                // .whatYouWillLearn(course.getContent() != null ? course.getContent().getWhatYouWillLearn() : null)
                // .tags(course.getContent() != null ? course.getContent().getTags() : null)
                // .isFeatured(course.getAnalytics() != null ? course.getAnalytics().getIsFeatured() : null)
                .isActive(course.getIsActive())
                // .createdAt(course.getCreatedAt())
                // .updatedAt(course.getUpdatedAt())
                .build();
    }
}