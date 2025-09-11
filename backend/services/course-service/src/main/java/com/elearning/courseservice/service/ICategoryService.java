package com.elearning.courseservice.service;

import com.elearning.courseservice.dto.response.CategoryResponse;

import java.util.List;

public interface ICategoryService {

    /**
     * Get all active categories ordered by sort order
     */
    List<CategoryResponse> getActiveCategories();

    /**
     * Get all categories ordered by sort order
     */
    List<CategoryResponse> getAllCategories();

    /**
     * Get category by ID
     */
    CategoryResponse getCategoryById(Long id);

    /**
     * Get category by code
     */
    CategoryResponse getCategoryByCode(String code);
}
