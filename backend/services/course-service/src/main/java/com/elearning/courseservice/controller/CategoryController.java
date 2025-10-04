package com.elearning.courseservice.controller;

import com.elearning.courseservice.dto.response.ApiResponse;
import com.elearning.courseservice.dto.response.CategoryBasicResponse;
import com.elearning.courseservice.dto.response.CategoryResponse;
import com.elearning.courseservice.services.CategoryService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getRootCategories() {
        List<CategoryResponse> categories = categoryService.getRootCategories();
        ApiResponse<List<CategoryResponse>> response = ApiResponse.success(categories, "Root categories retrieved successfully");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/basic")
    public ResponseEntity<ApiResponse<List<CategoryBasicResponse>>> getBasicRootCategories() {
        List<CategoryBasicResponse> categories = categoryService.getBasicRootCategories();
        ApiResponse<List<CategoryBasicResponse>> response = ApiResponse.success(categories, "Basic root categories retrieved successfully");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{parentId}/subcategories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getSubcategories(@PathVariable Long parentId) {
        List<CategoryResponse> categories = categoryService.getSubcategoriesByParentId(parentId);
        ApiResponse<List<CategoryResponse>> response = ApiResponse.success(categories, "Subcategories retrieved successfully");
        return ResponseEntity.ok(response);
    }
}
