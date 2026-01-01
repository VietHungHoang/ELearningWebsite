package com.elearning.commonservice.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class SubjectResponse {
    private UUID id;
    private String nameVi;
    private String nameEn;
    private UUID categoryId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}