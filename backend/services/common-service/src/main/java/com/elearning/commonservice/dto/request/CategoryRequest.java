package com.elearning.commonservice.dto.request;

import lombok.Data;

import java.util.UUID;

@Data
public class CategoryRequest {
    private String nameVi;
    private String nameEn;
    private String description;
    private UUID parentId;
}
