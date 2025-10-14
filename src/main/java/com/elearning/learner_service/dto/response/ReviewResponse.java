package com.elearning.learner_service.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private Long id;
    private Long accountId;
    private Long courseId;
    private Integer rating;
    private String comment;
    private Long createdAt;

    // Course info từ course-service
    private String courseTitle;
    private String courseThumbnail;
    private Integer totalReviews; // tổng số review của khóa học
    private Double ratingAverage; // rating trung bình của khóa học
}
