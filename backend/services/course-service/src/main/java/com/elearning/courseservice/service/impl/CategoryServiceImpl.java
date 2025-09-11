package com.elearning.courseservice.service.impl;

import com.elearning.courseservice.dto.response.CategoryResponse;
import com.elearning.courseservice.exception.CourseNotFoundException;
import com.elearning.courseservice.mapper.CategoryMapper;
import com.elearning.courseservice.model.Category;
import com.elearning.courseservice.repository.CategoryRepository;
import com.elearning.courseservice.service.ICategoryService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CategoryServiceImpl implements ICategoryService {
    
    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findByIsActiveTrueOrderByNameAsc()
                .stream()
                .map(CategoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAllByOrderByNameAsc()
                .stream()
                .map(CategoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CourseNotFoundException("Category not found with id: " + id));
        return CategoryMapper.toResponse(category);
    }

    @Override
    public CategoryResponse getCategoryByCode(String code) {
        Category category = categoryRepository.findByCode(code)
                .orElseThrow(() -> new CourseNotFoundException("Category not found with code: " + code));
        return CategoryMapper.toResponse(category);
    }
}
