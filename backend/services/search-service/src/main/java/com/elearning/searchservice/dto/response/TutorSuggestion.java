package com.elearning.searchservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Response DTO for tutor search suggestions
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorSuggestion {

    /**
     * Tutor ID
     */
    private UUID tutorId;

    /**
     * Tutor display name
     */
    private String name;

    /**
     * Tutor headline
     */
    private String headline;

    /**
     * Search relevance score
     */
    private Float score;
}