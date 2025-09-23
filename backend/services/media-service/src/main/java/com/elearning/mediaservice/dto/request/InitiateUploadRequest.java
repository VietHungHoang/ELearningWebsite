package com.elearning.mediaservice.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InitiateUploadRequest {
    
    @NotNull(message = "Lesson ID is required")
    private Long lessonId;
    
    @NotBlank(message = "File name is required")
    @Size(max = 255, message = "File name must not exceed 255 characters")
    private String fileName;
    
    @NotNull(message = "File size is required")
    @Min(value = 1, message = "File size must be greater than 0")
    @Max(value = 2147483648L, message = "File size must not exceed 2GB") // 2GB limit
    private Long fileSize;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @Builder.Default
    private Boolean isPreview = false;
}
