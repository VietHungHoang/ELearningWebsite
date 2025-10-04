package com.elearning.courseservice.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryBasicResponse {
    private Long id;
    private String name;
}