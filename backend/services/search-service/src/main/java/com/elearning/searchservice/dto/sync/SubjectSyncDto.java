package com.elearning.searchservice.dto.sync;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO for Subject data from common-service API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectSyncDto {
    private UUID id;
    private String nameVi;
    private String nameEn;
    private UUID categoryId;
}
