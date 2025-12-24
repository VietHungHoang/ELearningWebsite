package com.elearning.tutorservice.dto.review.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModerationResult {

    private boolean approved;
    private Integer errorCode;
    private String reason;
    private Double confidence;
}
