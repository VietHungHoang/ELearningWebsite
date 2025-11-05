package com.elearning.commonservice.service;

import com.elearning.commonservice.dto.request.LanguageRequest;
import com.elearning.commonservice.dto.response.LanguageResponse;

import java.util.List;
import java.util.UUID;

public interface LanguageService {
    LanguageResponse create(LanguageRequest request);

    LanguageResponse getById(UUID id);

    List<LanguageResponse> getAll();

    LanguageResponse update(UUID id, LanguageRequest request);

    void delete(UUID id);
}