package com.elearning.searchservice.dto.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Embedded category information for TutorDocument
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryInfo {
    
    private UUID id;
    private Boolean isParent;
    
    // Multi-language names (Vi, En only - matching common-service)
    private String nameVi;
    private String nameEn;
}
