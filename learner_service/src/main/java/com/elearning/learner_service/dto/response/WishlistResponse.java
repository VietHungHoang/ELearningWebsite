package com.elearning.learner_service.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistResponse {
    private Long id;
    private Long accountId;
    private Long courseId;
    private Long createdAt;

    // course info từ course-service
    private String courseTitle;
    private String courseThumbnail;
    private String courseDescription;

    // statistics
    private Integer totalStudents;
    private Integer totalLessons;
    private Double price;
    private Integer totalReviews;
    private Double rating;
}
