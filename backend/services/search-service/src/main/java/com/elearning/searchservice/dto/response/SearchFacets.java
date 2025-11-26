package com.elearning.searchservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Facet/Aggregation data for filtering
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchFacets {
    
    /**
     * Language facets: { "en": 45, "vi": 23, "ja": 12 }
     */
    private Map<String, Long> languages;
    
    /**
     * Category facets: { "categoryId": count }
     */
    private Map<String, Long> categories;
    
    /**
     * Price range facets: { "0-500": 12, "500-1000": 34 }
     */
    private Map<String, Long> priceRanges;
    
    /**
     * Rating facets: { "5": 10, "4-5": 45, "3-4": 23 }
     */
    private Map<String, Long> ratings;
    
    /**
     * Availability facets: { "MONDAY": 56, "TUESDAY": 48 }
     */
    private Map<String, Long> availableDays;
}
