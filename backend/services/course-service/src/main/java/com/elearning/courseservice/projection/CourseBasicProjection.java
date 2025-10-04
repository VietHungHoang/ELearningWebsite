package com.elearning.courseservice.projection;

/**
 * Projection interface for basic course information
 */
public interface CourseBasicProjection {
    Long getId();
    String getTitle();
    String getStatus();
    String getLevel();
    Long getCategoryId();
    Long getParentCategoryId(); // parent category ID from category
    Long getLanguageId();
    String getShortDescription(); // subtitle
    String getDescription();
}