package com.elearning.courseservice.services;

import java.util.List;

import com.elearning.courseservice.dto.response.CategoryBasicResponse;
import com.elearning.courseservice.dto.response.CategoryResponse;

public interface CategoryService {

    /**
     * Get all categories ordered by name
     */
    List<CategoryResponse> getActiveCategories();
    
    /**
     * Get all root categories (categories without parent)
     */
    List<CategoryResponse> getRootCategories();
    
    /**
     * Get basic root categories (only id and name)
     */
    List<CategoryBasicResponse> getBasicRootCategories();
    
    /**
     * Get subcategories of a parent category
     */
    List<CategoryResponse> getSubcategoriesByParentId(Long parentId);

    // /**
    //  * Get all categories ordered by sort order
    //  */
    // List<CategoryResponse> getAllCategories();

    /**
     * Get category by ID
     */
    CategoryResponse getCategoryById(Long id);
}
