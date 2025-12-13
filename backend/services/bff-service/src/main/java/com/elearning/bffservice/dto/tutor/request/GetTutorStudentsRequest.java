package com.elearning.bffservice.dto.tutor.request;

import lombok.Data;

@Data
public class GetTutorStudentsRequest {
    private int page = 0;
    private int size = 10;
    private String status;
    private String enrollmentType;
    private String search;
}
