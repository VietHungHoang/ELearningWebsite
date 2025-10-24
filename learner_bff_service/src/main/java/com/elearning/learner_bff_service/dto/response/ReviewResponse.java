package com.elearning.learner_bff_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private Long reviewId;
    private Long accountId;
    private Long courseId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
