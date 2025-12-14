package com.elearning.tutorservice.dto.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectInfo {
    private UUID id;
    private String nameVi;
    private String nameEn;
    private String nameJa;
    private UUID categoryId;
}