package com.elearning.learner_service.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequest {
    private Long accountId;
    private Long courseId;
    private Integer rating; // 1-5
    private String comment; // optional
}
