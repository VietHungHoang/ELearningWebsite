package com.elearning.classservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassMaterialRequest {

    @NotBlank(message = "Material name is required")
    private String name;

    @NotBlank(message = "Material type is required")
    private String type;

    @NotBlank(message = "S3 URL is required")
    private String s3Url;

    private Long fileSize;

    private String description;
}
