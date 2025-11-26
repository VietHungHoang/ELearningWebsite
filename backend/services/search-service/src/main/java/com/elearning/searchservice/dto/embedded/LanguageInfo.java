package com.elearning.searchservice.dto.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embedded language information for TutorDocument
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LanguageInfo {
    
    private String code; // "en", "vi", "ja"
    
    // Multi-language display names
    private String nameVi;
    private String nameEn;
    private String nameJa;
    
    private String proficiency; // "NATIVE", "FLUENT", "INTERMEDIATE", "BEGINNER"
}
