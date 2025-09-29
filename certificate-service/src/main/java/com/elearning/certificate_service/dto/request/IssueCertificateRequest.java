package com.elearning.certificate_service.dto.request;

import lombok.Data;

@Data
public class IssueCertificateRequest {
    private Long learnerId;
    private Long courseId;
    private Long instructorId;

    private String learnerName;
    private String courseName;
    private String instructorName;
    private String organizationName;
}
