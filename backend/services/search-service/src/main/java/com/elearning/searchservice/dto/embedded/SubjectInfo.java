package com.elearning.searchservice.dto.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Embedded subject information for TutorDocument
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectInfo {
    
    private UUID id;
    private UUID categoryId;
    
    // Multi-language names
    private String nameVi;
    private String nameEn;
    private String nameJa;
}
