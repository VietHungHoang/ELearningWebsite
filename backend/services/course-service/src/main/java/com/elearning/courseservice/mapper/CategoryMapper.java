package com.elearning.courseservice.mapper;

import com.elearning.courseservice.dto.response.CategoryBasicResponse;
import com.elearning.courseservice.dto.response.CategoryResponse;
import com.elearning.courseservice.model.Category;
import com.elearning.courseservice.projection.CategoryBasicProjection;

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
                .iconName(category.getIconName())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .parentName(category.getParent() != null ? category.getParent().getName() : null)
                .build();
    }
    
    /**
     * Convert Category entity to CategoryBasicResponse DTO (only id and name)
     */
    public static CategoryBasicResponse toBasicResponse(Category category) {
        if (category == null) {
            return null;
        }

        return CategoryBasicResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .build();
    }
    
    /**
     * Convert CategoryBasicProjection to CategoryBasicResponse DTO (optimized - no entity loading)
     */
    public static CategoryBasicResponse toBasicResponse(CategoryBasicProjection projection) {
        if (projection == null) {
            return null;
        }

        return CategoryBasicResponse.builder()
                .id(projection.getId())
                .name(projection.getName())
                .build();
    }
}
