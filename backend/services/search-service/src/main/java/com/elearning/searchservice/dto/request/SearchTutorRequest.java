package com.elearning.searchservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Request DTO for searching tutors with multi-language support
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchTutorRequest {
    
    // ============= SEARCH QUERY =============
    /**
     * Keyword to search (will search across name, bio, specialization, subjects, etc.)
     */
    private String keyword;
    
    /**
     * Language preference for search (vi, en, ja)
     * If not specified, search across all languages
     */
    private String language;
    
    // ============= FILTERS =============
    /**
     * Filter by teaching languages
     */
    private List<String> languageCodes;
    
    /**
     * Filter by category IDs
     */
    private List<UUID> categoryIds;
    
    /**
     * Filter by subject IDs
     */
    private List<UUID> subjectIds;
    
    /**
     * Filter by price range
     */
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    
    /**
     * Filter by minimum rating (e.g., 4.0)
     */
    private Double minRating;
    
    /**
     * Filter by available days (e.g., ["MONDAY", "TUESDAY"])
     */
    private List<String> availableDays;
    
    /**
     * Filter by nationality
     */
    private String nationalityCode;
    
    /**
     * Filter by class type
     */
    private Boolean hasGroup;
    private ClassType classType;
    
    /**
     * Only verified tutors
     */
    private Boolean onlyVerified;
    
    /**
     * Only tutors with video intro
     */
    private Boolean hasVideo;
    
    /**
     * Only tutors available now
     */
    private Boolean availableNow;
    
    // ============= SORTING =============
    /**
     * Sort field (relevance, rating, price, popularity)
     */
    @Builder.Default
    private String sortBy = "relevance";
    
    /**
     * Sort direction (asc, desc)
     */
    @Builder.Default
    private String sortDirection = "desc";
    
    // ============= PAGINATION =============
    @Builder.Default
    private Integer page = 0;
    
    @Builder.Default
    private Integer size = 10;
    
    // ============= ADVANCED =============
    /**
     * Enable fuzzy search for typo tolerance
     */
    @Builder.Default
    private Boolean fuzzy = true;
    
    /**
     * Include facets/aggregations in response
     */
    @Builder.Default
    private Boolean includeFacets = false;
}
