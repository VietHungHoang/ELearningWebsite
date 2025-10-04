package com.elearning.courseservice.mapper;

import com.elearning.courseservice.dto.response.CourseBasicResponse;
import com.elearning.courseservice.projection.CourseBasicProjection;

public class CourseMapper {

    /**
     * Convert CourseBasicProjection to CourseBasicResponse DTO (optimized - no entity loading)
     */
    public static CourseBasicResponse toBasicResponse(CourseBasicProjection projection) {
        if (projection == null) {
            return null;
        }

        return CourseBasicResponse.builder()
                .id(projection.getId())
                .title(projection.getTitle())
                .subtitle(projection.getShortDescription())
                .description(projection.getDescription())
                .categoryId(projection.getCategoryId())
                .subcategoryId(projection.getParentCategoryId())
                .level(projection.getLevel() != null ? projection.getLevel().toLowerCase() : null)
                .languageId(projection.getLanguageId())
                .status(projection.getStatus() != null ? projection.getStatus().toLowerCase() : null)
                .build();
    }
}
