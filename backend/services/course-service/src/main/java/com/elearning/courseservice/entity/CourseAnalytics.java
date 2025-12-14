// package com.elearning.courseservice.entity;

// import jakarta.persistence.*;
// import jakarta.validation.constraints.DecimalMax;
// import jakarta.validation.constraints.DecimalMin;
// import jakarta.validation.constraints.Min;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.EqualsAndHashCode;
// import lombok.NoArgsConstructor;
// import lombok.experimental.SuperBuilder;

// import java.math.BigDecimal;
// import java.util.UUID;

// @Entity
// @Table(name = "course_analytics")
// @Data
// @EqualsAndHashCode(callSuper = true)
// @NoArgsConstructor
// @AllArgsConstructor
// @SuperBuilder
// public class CourseAnalytics extends BaseEntity {
    
//     @Id
//     @Column(name = "course_id")
//     private UUID courseId;
    
//     @OneToOne(fetch = FetchType.LAZY)
//     @MapsId
//     @JoinColumn(name = "course_id")
//     private Course course;
    
//     @Min(value = 0, message = "Enrolled count cannot be negative")
//     @Builder.Default
//     private Integer enrolledCount = 0;
    
//     @Min(value = 0, message = "Completed count cannot be negative")
//     @Builder.Default
//     private Integer completedCount = 0;
    
//     @DecimalMin(value = "0.0", message = "Rating must be between 0 and 5")
//     @DecimalMax(value = "5.0", message = "Rating must be between 0 and 5")
//     @Column(precision = 3, scale = 2)
//     @Builder.Default
//     private BigDecimal averageRating = BigDecimal.ZERO;
    
//     @Min(value = 0, message = "Rating count cannot be negative")
//     @Builder.Default
//     private Integer ratingCount = 0;
    
//     @Min(value = 0, message = "Duration must be positive")
//     @Builder.Default
//     private Integer totalDurationMinutes = 0;
    
//     @Min(value = 0, message = "Lecture count cannot be negative")
//     @Builder.Default
//     private Integer totalLectures = 0;
    
//     @Min(value = 0, message = "Section count cannot be negative")
//     @Builder.Default
//     private Integer totalSections = 0;
    
//     @Builder.Default
//     private Boolean isFeatured = false;
// }