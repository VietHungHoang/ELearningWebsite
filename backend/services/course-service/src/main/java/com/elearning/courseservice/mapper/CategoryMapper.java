package com.elearning.courseservice.mapper;

import com.elearning.courseservice.dto.response.CategoryResponse;
import com.elearning.courseservice.model.Category;

public class CategoryMapper {

    /**
     * Convert Category entity to CategoryResponse DTO
     */
    public static CategoryResponse toResponse(Category category) {
        if (category == null) {
            return null;
        }

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .code(category.getCode())
                .isActive(category.getIsActive())
                .build();
    }
}
