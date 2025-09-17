package com.elearning.contentservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageUploadRequest {
    
    @NotBlank(message = "Content type is required")
    @Pattern(regexp = "^image/(jpeg|jpg|png|webp)$", 
             message = "Content type must be image/jpeg, image/jpg, image/png, or image/webp")
    private String contentType;
    
    @NotNull(message = "Course ID is required")
    private Long courseId;
    
    private String description;
}