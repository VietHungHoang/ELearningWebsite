package com.elearning.bffservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Request DTO for searching tutors (matches Search Service API)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchTutorRequest {
    
    // Search query
    private String keyword;
    private String language; // "vi", "en", "ja"
    
    // Filters
    private List<String> languageCodes;
    private UUID categoryId;
    private UUID subjectId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Double minRating;
    private List<String> availableDays;
    private String nationalityCode;
    private Boolean hasGroup;
    private ClassType classType;
    private Boolean onlyVerified;
    private Boolean hasVideo;
    private Boolean availableNow;
    
    // Sorting
    @Builder.Default
    private String sortBy = "relevance";
    
    @Builder.Default
    private String sortDirection = "desc";
    
    // Pagination
    @Builder.Default
    private Integer page = 0;
    
    @Builder.Default
    private Integer size = 10;
    
    // Advanced
    @Builder.Default
    private Boolean fuzzy = true;
    
    @Builder.Default
    private Boolean includeFacets = false;
}
