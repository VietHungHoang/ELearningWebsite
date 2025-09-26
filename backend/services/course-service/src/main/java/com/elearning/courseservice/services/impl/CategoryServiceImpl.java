package com.elearning.courseservice.services.impl;

import com.elearning.courseservice.dto.response.CategoryResponse;
import com.elearning.courseservice.exception.CategoryNotFoundException;
import com.elearning.courseservice.mapper.CategoryMapper;
import com.elearning.courseservice.model.Category;
import com.elearning.courseservice.repository.CategoryRepository;
import com.elearning.courseservice.services.CategoryService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    
    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findByIsActiveTrueOrderByNameAsc()
                .stream()
                .map(CategoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    // @Override
    // public List<CategoryResponse> getAllCategories() {
    //     return categoryRepository.findAllByOrderByNameAsc()
    //             .stream()
    //             .map(CategoryMapper::toResponse)
    //             .collect(Collectors.toList());
    // }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + id));
        return CategoryMapper.toResponse(category);
    }
}
