package com.elearning.courseservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateDraftCourseRequest {
    
    @NotBlank(message = "Course title is required")
    @Size(max = 120, message = "Course title must not exceed 120 characters")
    private String title;
    
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    
    @NotBlank(message = "Level is required")
    @Pattern(regexp = "^(beginner|intermediate|advanced|all-levels)$", 
             message = "Level must be one of: beginner, intermediate, advanced, all-levels")
    private String level;
}