package com.elearning.courseservice.dto.response;

import com.elearning.courseservice.enums.CourseLevel;
import com.elearning.courseservice.enums.CourseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponse {
    
    private Long id;
    private String title;
    private String description;
    private String shortDescription;
    private Long instructorId;
    private CourseStatus status;
    private CategoryResponse category;
    private CourseLevel level;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private String thumbnailUrl;

    private Integer durationMinutes;
    private Integer enrolledCount;
    private BigDecimal averageRating;
    private Integer ratingCount;
    private String requirements;
    private String whatYouWillLearn;
    private String tags;
    private Boolean isFeatured;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
