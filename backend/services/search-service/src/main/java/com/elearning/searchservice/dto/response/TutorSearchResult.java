package com.elearning.searchservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Enhanced search result with score and metadata
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorSearchResult {
    
    /**
     * Tutor ID
     */
    private UUID tutorId;
    
    /**
     * Search relevance score
     */
    private Float score;
    
    /**
     * Highlighted fields (for showing search matches)
     */
    private Map<String, List<String>> highlights;
    
    /**
     * Matched fields (which fields contributed to the match)
     */
    private List<String> matchedFields;
}
