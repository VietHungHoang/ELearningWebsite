package com.elearning.courseservice.model;

import com.elearning.courseservice.enums.CourseLevel;
import com.elearning.courseservice.enums.CourseStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(nullable = false)
    private String title;
    
    @NotBlank(message = "Description is required")
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String shortDescription;
    
    @NotNull(message = "Instructor ID is required")
    @Column(nullable = false)
    private Long instructorId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CourseStatus status = CourseStatus.DRAFT;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @NotNull(message = "Category is required")
    private Category category;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CourseLevel level = CourseLevel.BEGINNER;
    
    @DecimalMin(value = "0.00", message = "Price must be positive")
    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal price = BigDecimal.ZERO; 
    
    @DecimalMin(value = "0.00", message = "Discount price must be positive")
    @Column(precision = 10, scale = 2)
    private BigDecimal discountPrice;
    
    private String thumbnailUrl;     

    @Min(value = 0, message = "Duration must be positive")
    private Integer durationMinutes;
    
    @Min(value = 0, message = "Enrolled count cannot be negative")
    @Builder.Default
    private Integer enrolledCount = 0;
    
    @DecimalMin(value = "0.0", message = "Rating must be between 0 and 5")
    @DecimalMax(value = "5.0", message = "Rating must be between 0 and 5")
    @Builder.Default
    private BigDecimal averageRating = BigDecimal.ZERO;
    
    @Min(value = 0, message = "Rating count cannot be negative")
    @Builder.Default
    private Integer ratingCount = 0;
    
    @Column(columnDefinition = "TEXT")
    private String requirements;
    
    @Column(columnDefinition = "TEXT")
    private String whatYouWillLearn;
    
    @Column(columnDefinition = "TEXT")
    private String tags;     

    @Builder.Default
    private Boolean isFeatured = false;     
    
    @Builder.Default
    private Boolean isActive = true;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
