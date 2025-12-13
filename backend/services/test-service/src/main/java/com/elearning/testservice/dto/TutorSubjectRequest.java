package com.elearning.testservice.dto;

import lombok.Data;

@Data
public class TutorSubjectRequest {
    private Long categoryId;
    private String subjectName;
}