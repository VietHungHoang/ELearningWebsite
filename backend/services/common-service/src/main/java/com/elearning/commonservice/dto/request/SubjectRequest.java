package com.elearning.commonservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class SubjectRequest {
    @NotBlank(message = "Vietnamese name is required")
    private String nameVi;

    @NotBlank(message = "English name is required")
    private String nameEn;

    private UUID categoryId;
}
