package com.elearning.searchservice.dto.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embedded work experience information for TutorDocument
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceInfo {
    
    // Multi-language titles
    private String titleVi;
    private String titleEn;
    private String titleJa;
    
    private String company;
    private Integer years;
    private String location;
}
