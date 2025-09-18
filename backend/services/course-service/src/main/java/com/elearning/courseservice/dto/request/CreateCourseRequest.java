package com.elearning.courseservice.dto.request;

import com.elearning.courseservice.enums.CourseLevel;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCourseRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private String shortDescription;
    
    @NotNull(message = "Instructor ID is required")
    private Long instructorId;
    
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    
    private CourseLevel level;
    
    @DecimalMin(value = "0.00", message = "Price must be positive")
    private BigDecimal price;
    
    @DecimalMin(value = "0.00", message = "Discount price must be positive")
    private BigDecimal discountPrice;
    
    private String thumbnailUrl;
    
    @Min(value = 0, message = "Duration must be positive")
    private Integer durationMinutes;
    
    private String requirements;
    
    private String whatYouWillLearn;
    
    private String tags;
    
    @Builder.Default
    private Boolean isFeatured = false;
}
