package com.elearning.tutorservice.dto.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EducationInfo {
    private String titleVi;
    private String titleEn;
    private String titleJa;
    private String institution;
    private Integer graduationYear;
}