package com.elearning.commonservice.dto.request;

import lombok.Data;

import java.util.UUID;

@Data
public class CategoryRequest {
    private String name;
    private String description;
    private UUID parentId;
}
