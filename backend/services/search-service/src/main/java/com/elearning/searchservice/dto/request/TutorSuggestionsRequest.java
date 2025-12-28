package com.elearning.searchservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for tutor search suggestions
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorSuggestionsRequest {

    /**
     * Keyword to search for suggestions
     */
    private String keyword;

    /**
     * Language preference for suggestions (vi, en, ja)
     */
    private String language;

    /**
     * Maximum number of suggestions to return
     */
    @Builder.Default
    private Integer limit = 10;
}