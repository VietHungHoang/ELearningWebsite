package com.elearning.tutorservice.dto.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LanguageInfo {
    private String code;
    private String nameVi;
    private String nameEn;
    private String nameJa;
}