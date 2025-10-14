package com.elearning.learner_service.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentResponse {
    private Long id;
    private Long accountId;
    private Long courseId;
    private String status;
    private Long enrolledAt;
    private Long startedAt;
    private Long completedAt;

    // course info từ course-service
    private String courseTitle;
    private String courseThumbnail;
    private String courseDescription;
    private Integer totalStudents;
    private Integer totalLessons;
    private Double price;
    private Integer totalReviews;
    private Double rating;
}
