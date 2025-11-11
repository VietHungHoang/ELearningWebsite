package com.elearning.searchservice.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface SearchService {
    Page<UUID> searchTutors(
        String keyword,
        Boolean teachesInGroups,
        String categoryName,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        List<String> languageCodes,
        Pageable pageable
    );
}