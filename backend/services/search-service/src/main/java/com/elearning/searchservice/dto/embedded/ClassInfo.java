package com.elearning.searchservice.dto.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Embedded active class information for TutorDocument
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassInfo {
    
    private UUID id;
    
    // Multi-language titles
    private String titleVi;
    private String titleEn;
    private String titleJa;
    
    private String subject;
    private String type; // "ONE_ON_ONE", "GROUP"
    private Integer maxStudents;
    private Integer currentEnrollments;
}
