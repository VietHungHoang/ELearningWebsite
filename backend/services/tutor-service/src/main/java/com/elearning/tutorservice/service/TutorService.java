package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.response.TutorSearchResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface TutorService {
    Page<TutorSearchResponse> searchTutors(List<String> languageCodes, BigDecimal minPrice, BigDecimal maxPrice, List<UUID> categoryIds, List<String> availableDays, Pageable pageable);
}