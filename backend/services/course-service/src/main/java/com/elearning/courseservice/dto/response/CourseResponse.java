package com.elearning.courseservice.dto.response;

import com.elearning.courseservice.enums.CourseLevel;
import com.elearning.courseservice.enums.CourseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponse {
    
    private UUID id;
    private String title;
    private String description;
    private String shortDescription;
    private UUID tutorId;
    private CourseStatus status;
    private CourseLevel level;
    private BigDecimal price;
    private BigDecimal oldPrice;
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
}
