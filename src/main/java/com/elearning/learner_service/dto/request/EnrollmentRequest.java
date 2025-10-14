package com.elearning.learner_service.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentRequest {
    private Long accountId;
    private Long courseId;
}
