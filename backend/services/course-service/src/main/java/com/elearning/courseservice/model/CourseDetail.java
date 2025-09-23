package com.elearning.courseservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "course_content")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class CourseDetail extends BaseEntity {
    
    @Id
    @Column(name = "course_id")
    private Long courseId;
    
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "course_id")
    private Course course;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Size(max = 500, message = "Short description must not exceed 500 characters")
    @Column(columnDefinition = "TEXT")
    private String shortDescription;
    
    @Size(max = 500, message = "Thumbnail URL must not exceed 500 characters")
    private String thumbnailUrl;
    
    @Size(max = 500, message = "Promo video URL must not exceed 500 characters")
    private String promoVideoUrl;
    
    @Column(columnDefinition = "TEXT")
    private String requirements;
    
    @Column(columnDefinition = "TEXT")
    private String whatYouWillLearn;
    
    @Column(columnDefinition = "TEXT")
    private String tags;
    
    @Size(max = 10, message = "Language code must not exceed 10 characters")
    @Builder.Default
    private String language = "vi";
}