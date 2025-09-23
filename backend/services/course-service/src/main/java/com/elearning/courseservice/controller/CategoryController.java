package com.elearning.courseservice.controller;

import com.elearning.courseservice.dto.response.ApiResponse;
import com.elearning.courseservice.dto.response.CategoryResponse;
import com.elearning.courseservice.service.CategoryService;
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
    
    // @GetMapping
    // public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
    //     List<CategoryResponse> categories = categoryService.getAllCategories();
    //     ApiResponse<List<CategoryResponse>> response = ApiResponse.success(categories, "Categories retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
    
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getActiveCategories() {
        List<CategoryResponse> categories = categoryService.getActiveCategories();
        ApiResponse<List<CategoryResponse>> response = ApiResponse.success(categories, "Active categories retrieved successfully");
        return ResponseEntity.ok(response);
    }
    
    // @GetMapping("/{id}")
    // public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
    //     CategoryResponse category = categoryService.getCategoryById(id);
    //     ApiResponse<CategoryResponse> response = ApiResponse.success(category, "Category retrieved successfully");
    //     return ResponseEntity.ok(response);
    // }
}
