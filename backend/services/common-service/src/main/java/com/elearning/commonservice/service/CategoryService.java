package com.elearning.commonservice.service;

import com.elearning.commonservice.dto.request.CategoryRequest;
import com.elearning.commonservice.dto.response.CategoryResponse;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    CategoryResponse create(CategoryRequest request);

    CategoryResponse getById(UUID id);

    List<CategoryResponse> getAll();

    CategoryResponse update(UUID id, CategoryRequest request);

    void delete(UUID id);
}
