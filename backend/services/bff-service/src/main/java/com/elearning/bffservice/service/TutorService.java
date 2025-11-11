package com.elearning.bffservice.service;

import com.elearning.bffservice.dto.response.TutorSearchResponse;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface TutorService {
    Page<TutorSearchResponse> searchTutors(List<String> languageCodes, BigDecimal minPrice, BigDecimal maxPrice, UUID categoryId, boolean categoryIsParent, List<String> availableDays, int page, int size);
}