package com.elearning.bffservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Search result from Search Service with score and metadata
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorSearchResult {
    
    private UUID tutorId;
    private Float score;
    private Map<String, List<String>> highlights;
    private List<String> matchedFields;
}
