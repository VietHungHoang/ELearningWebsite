package com.elearning.commonservice.service;

import com.elearning.commonservice.dto.response.LanguageResponse;

import java.util.List;
import java.util.UUID;

public interface LanguageService {
    LanguageResponse getById(UUID id);

    List<LanguageResponse> getAll();
}