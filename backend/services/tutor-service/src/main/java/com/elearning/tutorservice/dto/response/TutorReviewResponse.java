package com.elearning.tutorservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TutorReviewResponse {
    private UUID id;
    private UUID studentId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
