package com.elearning.searchservice.dto.sync;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO for Category data from common-service API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategorySyncDto {
    private UUID id;
    private String nameVi;
    private String nameEn;
    private String description;
    private UUID parentId;
}
