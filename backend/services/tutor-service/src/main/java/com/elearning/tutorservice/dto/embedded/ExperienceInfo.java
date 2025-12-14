package com.elearning.tutorservice.dto.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceInfo {
    private String titleVi;
    private String titleEn;
    private String titleJa;
    private String company;
    private Integer years;
}