package com.elearning.quiz.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sections")
public class Section {
    @Id
    private String id;
    
    @Column(name = "course_id", nullable = false)
    private String courseId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(name = "is_expanded")
    private Boolean isExpanded = false;
    
    private Integer completed = 0;
    private Integer total = 0;
    private String duration;
    
    @Column(name = "is_unlocked")
    private Boolean isUnlocked = false;
    
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
    public Section() {}
    
    public Section(String id, String courseId, String title, Boolean isExpanded, Integer completed, Integer total, String duration, Boolean isUnlocked, Integer orderIndex, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.courseId = courseId;
        this.title = title;
        this.isExpanded = isExpanded;
        this.completed = completed;
        this.total = total;
        this.duration = duration;
        this.isUnlocked = isUnlocked;
        this.orderIndex = orderIndex;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public Boolean getIsExpanded() { return isExpanded; }
    public void setIsExpanded(Boolean isExpanded) { this.isExpanded = isExpanded; }
    
    public Integer getCompleted() { return completed; }
    public void setCompleted(Integer completed) { this.completed = completed; }
    
    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }
    
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    
    public Boolean getIsUnlocked() { return isUnlocked; }
    public void setIsUnlocked(Boolean isUnlocked) { this.isUnlocked = isUnlocked; }
    
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
