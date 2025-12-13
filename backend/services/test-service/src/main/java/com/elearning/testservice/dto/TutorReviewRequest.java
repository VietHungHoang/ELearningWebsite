package com.elearning.testservice.dto;

import lombok.Data;

@Data
public class TutorReviewRequest {
    private Integer rating;
    private String comment;
}