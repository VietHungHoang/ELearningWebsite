package com.elearning.courseservice.projection;

/**
 * Projection interface for basic category information (id and name only)
 */
public interface CategoryBasicProjection {
    Long getId();
    String getName();
}