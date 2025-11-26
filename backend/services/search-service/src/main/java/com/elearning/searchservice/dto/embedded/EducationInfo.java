package com.elearning.searchservice.dto.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embedded education information for TutorDocument
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EducationInfo {
    
    // Multi-language titles
    private String titleVi;
    private String titleEn;
    private String titleJa;
    
    private String institution;
    private Integer year;
    private String location;
}
