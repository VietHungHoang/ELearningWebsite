package com.elearning.commonservice.service.impl;

import com.elearning.commonservice.dto.request.CategoryRequest;
import com.elearning.commonservice.dto.response.CategoryResponse;
import com.elearning.commonservice.entity.Category;
import com.elearning.commonservice.mapper.CategoryMapper;
import com.elearning.commonservice.repository.CategoryRepository;
import com.elearning.commonservice.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public CategoryResponse create(CategoryRequest request) {
        Category category = categoryMapper.toEntity(request);
        Category created = categoryRepository.save(category);

        return categoryMapper.toResponse(created);
    }

    @Override
    public CategoryResponse getById(UUID id) {
        Category category = getCategoryById(id);
        return categoryMapper.toResponse(category);
    }

    @Override
    public List<CategoryResponse> getAll() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse update(UUID id, CategoryRequest request) {
        Category existing = getCategoryById(id);
        existing.setNameEn(request.getNameEn());
        existing.setNameVi(request.getNameVi());
        existing.setDescription(request.getDescription());

        Category updated = categoryRepository.save(existing);
        return categoryMapper.toResponse(updated);
    }

    @Override
    public void delete(UUID id) {
        categoryRepository.deleteById(id);
    }

    private Category getCategoryById(UUID id) {
        Optional<Category> opt = categoryRepository.findById(id);
        return opt.orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }
}
