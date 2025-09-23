package com.elearning.courseservice.model;

import com.elearning.courseservice.enums.CourseLevel;
import com.elearning.courseservice.enums.CourseStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "courses")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Course extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(nullable = false)
    private String title;
    
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
    
    @Builder.Default
    private Boolean isActive = true;
    
    // Lazy-loaded related entities
    @OneToOne(mappedBy = "course", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private CourseDetail content;
    
    @OneToOne(mappedBy = "course", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private CoursePricing pricing;
    
    @OneToOne(mappedBy = "course", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private CourseAnalytics analytics;
}
