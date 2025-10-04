package com.elearning.courseservice.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseBasicResponse {
    private Long id;
    private String title;
    private String subtitle; // shortDescription from CourseDetail
    private String description;
    private Long categoryId;
    private Long subcategoryId; // parent category ID if category has parent
    private String level; // lowercase enum value
    private Long languageId;
    private String status; // lowercase enum value
}