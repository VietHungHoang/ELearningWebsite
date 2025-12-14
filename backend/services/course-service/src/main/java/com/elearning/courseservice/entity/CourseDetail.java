// package com.elearning.courseservice.entity;

// import jakarta.persistence.*;
// import jakarta.validation.constraints.Size;
// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.EqualsAndHashCode;
// import lombok.NoArgsConstructor;
// import lombok.experimental.SuperBuilder;
// import java.util.UUID;

// @Entity
// @Table(name = "course_content")
// @Data
// @EqualsAndHashCode(callSuper = true)
// @NoArgsConstructor
// @AllArgsConstructor
// @SuperBuilder
// public class CourseDetail extends BaseEntity {
    
//     @Id
//     @Column(name = "course_id")
//     private UUID courseId;
    
//     @OneToOne(fetch = FetchType.LAZY)
//     @MapsId
//     @JoinColumn(name = "course_id")
//     private Course course;
    
//     @Column(columnDefinition = "TEXT")
//     private String description;
    
//     @Size(max = 500, message = "Short description must not exceed 500 characters")
//     @Column(columnDefinition = "TEXT")
//     private String shortDescription;
    
//     @Size(max = 500, message = "Thumbnail URL must not exceed 500 characters")
//     private String thumbnailUrl;
    
//     @Size(max = 500, message = "Promo video URL must not exceed 500 characters")
//     private String promoVideoUrl;
    
//     @Column(columnDefinition = "TEXT")
//     private String requirements;
    
//     @Column(columnDefinition = "TEXT")
//     private String whatYouWillLearn;
    
//     @Column(columnDefinition = "TEXT")
//     private String tags;
    
//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "language_id")
//     private Language language;
// }