package com.elearning.courseservice.mapper;

import com.elearning.courseservice.dto.request.CreateCourseRequest;
import com.elearning.courseservice.dto.response.CourseResponse;
import com.elearning.courseservice.model.Course;

public class CourseMapper {

    /**
     * Convert Course entity to CourseResponse DTO
     */
    public static CourseResponse toResponse(Course course) {
        if (course == null) {
            return null;
        }

        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .shortDescription(course.getShortDescription())
                .instructorId(course.getInstructorId())
                .status(course.getStatus())
                .category(CategoryMapper.toResponse(course.getCategory()))
                .level(course.getLevel())
                .price(course.getPrice())
                .discountPrice(course.getDiscountPrice())
                .thumbnailUrl(course.getThumbnailUrl())
                .durationMinutes(course.getDurationMinutes())
                .enrolledCount(course.getEnrolledCount())
                .averageRating(course.getAverageRating())
                .ratingCount(course.getRatingCount())
                .requirements(course.getRequirements())
                .whatYouWillLearn(course.getWhatYouWillLearn())
                .tags(course.getTags())
                .isFeatured(course.getIsFeatured())
                .isActive(course.getIsActive())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }

    /**
     * Convert CreateCourseRequest DTO to Course entity (category will be set separately)
     */
    public static Course toEntity(CreateCourseRequest request) {
        if (request == null) {
            return null;
        }

        return Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .shortDescription(request.getShortDescription())
                .instructorId(request.getInstructorId())
                // category will be set separately using categoryId
                .level(request.getLevel())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .thumbnailUrl(request.getThumbnailUrl())
                .durationMinutes(request.getDurationMinutes())
                .requirements(request.getRequirements())
                .whatYouWillLearn(request.getWhatYouWillLearn())
                .tags(request.getTags())
                .isFeatured(request.getIsFeatured())
                .build();
    }

    /**
     * Update existing Course entity with data from CreateCourseRequest (category will be set separately)
     */
    public static Course updateEntity(Course existingCourse, CreateCourseRequest request) {
        if (existingCourse == null || request == null) {
            return existingCourse;
        }

        return Course.builder()
                .id(existingCourse.getId()) // Keep existing ID
                .title(request.getTitle())
                .description(request.getDescription())
                .shortDescription(request.getShortDescription())
                .instructorId(request.getInstructorId())
                .status(existingCourse.getStatus()) // Keep existing status
                // category will be set separately using categoryId
                .level(request.getLevel())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .thumbnailUrl(request.getThumbnailUrl())
                .durationMinutes(request.getDurationMinutes())
                .enrolledCount(existingCourse.getEnrolledCount()) // Keep existing count
                .averageRating(existingCourse.getAverageRating()) // Keep existing rating
                .ratingCount(existingCourse.getRatingCount()) // Keep existing rating count
                .requirements(request.getRequirements())
                .whatYouWillLearn(request.getWhatYouWillLearn())
                .tags(request.getTags())
                .isFeatured(request.getIsFeatured())
                .isActive(existingCourse.getIsActive()) // Keep existing active status
                .createdAt(existingCourse.getCreatedAt()) // Keep creation time
                .build();
    }
}
