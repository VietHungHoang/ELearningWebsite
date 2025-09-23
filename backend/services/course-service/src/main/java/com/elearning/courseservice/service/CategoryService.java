package com.elearning.courseservice.service;

import java.util.List;

import com.elearning.courseservice.dto.response.CategoryResponse;

public interface CategoryService {

    /**
     * Get all active categories ordered by sort order
     */
    List<CategoryResponse> getActiveCategories();

    // /**
    //  * Get all categories ordered by sort order
    //  */
    // List<CategoryResponse> getAllCategories();

    /**
     * Get category by ID
     */
    CategoryResponse getCategoryById(Long id);
}
