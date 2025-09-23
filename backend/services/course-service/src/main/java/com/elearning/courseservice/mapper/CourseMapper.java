// package com.elearning.courseservice.mapper;

// import com.elearning.courseservice.dto.request.CreateCourseRequest;
// import com.elearning.courseservice.dto.response.CourseResponse;
// import com.elearning.courseservice.model.Course;

// public class CourseMapper {

//     /**
//      * Convert Course entity to CourseResponse DTO
//      */
//     public static CourseResponse toResponse(Course course) {
//         if (course == null) {
//             return null;
//         }

//         return CourseResponse.builder()
//                 .id(course.getId())
//                 .title(course.getTitle())
//                 .instructorId(course.getInstructorId())
//                 .status(course.getStatus())
//                 .category(CategoryMapper.toResponse(course.getCategory()))
//                 .level(course.getLevel())
//                 .isActive(course.getIsActive())
//                 .createdAt(course.getCreatedAt())
//                 .updatedAt(course.getUpdatedAt())
//                 .build();
//     }

//     /**
//      * Convert CreateCourseRequest DTO to Course entity (category will be set separately)
//      */
//     public static Course toEntity(CreateCourseRequest request) {
//         if (request == null) {
//             return null;
//         }

//         return Course.builder()
//                 .title(request.getTitle())
//                 .instructorId(request.getInstructorId())
//                 // category will be set separately using categoryId
//                 .level(request.getLevel())
//                 .build();
//     }

//     /**
//      * Update existing Course entity with data from CreateCourseRequest (category will be set separately)
//      */
//     public static Course updateEntity(Course existingCourse, CreateCourseRequest request) {
//         if (existingCourse == null || request == null) {
//             return existingCourse;
//         }

//         return Course.builder()
//                 .id(existingCourse.getId()) // Keep existing ID
//                 .title(request.getTitle())
//                 .instructorId(request.getInstructorId())
//                 .status(existingCourse.getStatus()) // Keep existing status
//                 // category will be set separately using categoryId
//                 .level(request.getLevel())
//                 .isActive(existingCourse.getIsActive()) // Keep existing active status
//                 .createdAt(existingCourse.getCreatedAt()) // Keep creation time
//                 .build();
//     }
// }
