package com.elearning.commonservice.mapper;

import com.elearning.commonservice.dto.request.CategoryRequest;
import com.elearning.commonservice.dto.response.CategoryResponse;
import com.elearning.commonservice.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public Category toEntity(CategoryRequest request) {
        Category category = Category.builder()
                .nameVi(request.getNameVi())
                .nameEn(request.getNameEn())
                .description(request.getDescription())
                .build();

        return category;
    }

    public CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .nameVi(category.getNameVi())
                .nameEn(category.getNameEn())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}