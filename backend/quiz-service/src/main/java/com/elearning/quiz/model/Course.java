package com.elearning.quiz.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(unique = true, nullable = false)
    private String slug;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "short_description")
    private String shortDescription;
    
    private String thumbnail;
    
    @Column(name = "video_url")
    private String videoUrl;
    
    @Column(name = "instructor_name")
    private String instructorName;
    
    @Column(name = "instructor_avatar")
    private String instructorAvatar;
    
    @Column(name = "instructor_title")
    private String instructorTitle;
    
    private String duration;
    private String level;
    private Double rating;
    
    @Column(name = "students_count")
    private Integer studentsCount;
    
    private Double price;
    
    @Column(name = "original_price")
    private Double originalPrice;
    
    @Column(name = "is_enrolled")
    private Boolean isEnrolled = false;
    
    @Column(name = "last_accessed")
    private LocalDateTime lastAccessed;
    
    @Column(name = "completion_percentage")
    private Integer completionPercentage = 0;
    
    @Column(name = "total_lessons")
    private Integer totalLessons = 0;
    
    @Column(name = "completed_lessons")
    private Integer completedLessons = 0;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Course() {}
    
    public Course(String id, String title, String slug, String description, String shortDescription, String thumbnail, String videoUrl, String instructorName, String instructorAvatar, String instructorTitle, String duration, String level, Double rating, Integer studentsCount, Double price, Double originalPrice, Boolean isEnrolled, LocalDateTime lastAccessed, Integer completionPercentage, Integer totalLessons, Integer completedLessons, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.shortDescription = shortDescription;
        this.thumbnail = thumbnail;
        this.videoUrl = videoUrl;
        this.instructorName = instructorName;
        this.instructorAvatar = instructorAvatar;
        this.instructorTitle = instructorTitle;
        this.duration = duration;
        this.level = level;
        this.rating = rating;
        this.studentsCount = studentsCount;
        this.price = price;
        this.originalPrice = originalPrice;
        this.isEnrolled = isEnrolled;
        this.lastAccessed = lastAccessed;
        this.completionPercentage = completionPercentage;
        this.totalLessons = totalLessons;
        this.completedLessons = completedLessons;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
    
    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }
    
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    
    public String getInstructorName() { return instructorName; }
    public void setInstructorName(String instructorName) { this.instructorName = instructorName; }
    
    public String getInstructorAvatar() { return instructorAvatar; }
    public void setInstructorAvatar(String instructorAvatar) { this.instructorAvatar = instructorAvatar; }
    
    public String getInstructorTitle() { return instructorTitle; }
    public void setInstructorTitle(String instructorTitle) { this.instructorTitle = instructorTitle; }
    
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    
    public Integer getStudentsCount() { return studentsCount; }
    public void setStudentsCount(Integer studentsCount) { this.studentsCount = studentsCount; }
    
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    
    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }
    
    public Boolean getIsEnrolled() { return isEnrolled; }
    public void setIsEnrolled(Boolean isEnrolled) { this.isEnrolled = isEnrolled; }
    
    public LocalDateTime getLastAccessed() { return lastAccessed; }
    public void setLastAccessed(LocalDateTime lastAccessed) { this.lastAccessed = lastAccessed; }
    
    public Integer getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(Integer completionPercentage) { this.completionPercentage = completionPercentage; }
    
    public Integer getTotalLessons() { return totalLessons; }
    public void setTotalLessons(Integer totalLessons) { this.totalLessons = totalLessons; }
    
    public Integer getCompletedLessons() { return completedLessons; }
    public void setCompletedLessons(Integer completedLessons) { this.completedLessons = completedLessons; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
