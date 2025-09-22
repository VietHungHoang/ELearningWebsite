package com.elearning.quiz.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lessons")
public class Lesson {
    @Id
    private String id;
    
    @Column(name = "section_id", nullable = false)
    private String sectionId;
    
    @Column(name = "course_id", nullable = false)
    private String courseId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String duration;
    
    @Column(name = "is_completed")
    private Boolean isCompleted = false;
    
    @Column(name = "is_current")
    private Boolean isCurrent = false;
    
    @Column(name = "is_locked")
    private Boolean isLocked = false;
    
    @Column(name = "video_url")
    private String videoUrl;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "order_index")
    private Integer orderIndex = 0;
    
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
    public Lesson() {}
    
    public Lesson(String id, String sectionId, String courseId, String title, String description, String duration, Boolean isCompleted, Boolean isCurrent, Boolean isLocked, String videoUrl, String content, Integer orderIndex, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.sectionId = sectionId;
        this.courseId = courseId;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.isCompleted = isCompleted;
        this.isCurrent = isCurrent;
        this.isLocked = isLocked;
        this.videoUrl = videoUrl;
        this.content = content;
        this.orderIndex = orderIndex;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getSectionId() { return sectionId; }
    public void setSectionId(String sectionId) { this.sectionId = sectionId; }
    
    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    
    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }
    
    public Boolean getIsCurrent() { return isCurrent; }
    public void setIsCurrent(Boolean isCurrent) { this.isCurrent = isCurrent; }
    
    public Boolean getIsLocked() { return isLocked; }
    public void setIsLocked(Boolean isLocked) { this.isLocked = isLocked; }
    
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
