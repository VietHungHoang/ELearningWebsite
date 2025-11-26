package com.elearning.searchservice.service;

import com.elearning.searchservice.dto.request.SearchTutorRequest;
import com.elearning.searchservice.dto.response.SearchFacets;
import com.elearning.searchservice.dto.response.TutorSearchResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface SearchService {
    
    /**
     * Search tutors with enhanced multi-language support
     */
    Page<TutorSearchResult> searchTutors(SearchTutorRequest request);
    
    /**
     * Get search facets/aggregations
     */
    SearchFacets getSearchFacets(SearchTutorRequest request);
    
    /**
     * Legacy search method (deprecated, for backward compatibility)
     */
    @Deprecated
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