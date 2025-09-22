package com.elearning.quiz.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CourseDto {
    private String id;
    private String title;
    private String slug;
    private String description;
    private String shortDescription;
    private int progress;
    private String thumbnail;
    private String videoUrl;
    private InstructorDto instructor;
    private String duration;
    private String level;
    private double rating;
    private int studentsCount;
    private double price;
    private double originalPrice;
    private boolean isEnrolled;
    private String lastAccessed;
    private int completionPercentage;
    private int totalLessons;
    private int completedLessons;
    private List<SectionDto> sections;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public CourseDto() {}

    public CourseDto(String id, String title, String slug, String description, String shortDescription,
                    int progress, String thumbnail, String videoUrl, InstructorDto instructor,
                    String duration, String level, double rating, int studentsCount,
                    double price, double originalPrice, boolean isEnrolled, String lastAccessed,
                    int completionPercentage, int totalLessons, int completedLessons,
                    List<SectionDto> sections) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.shortDescription = shortDescription;
        this.progress = progress;
        this.thumbnail = thumbnail;
        this.videoUrl = videoUrl;
        this.instructor = instructor;
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
        this.sections = sections;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public InstructorDto getInstructor() {
        return instructor;
    }

    public void setInstructor(InstructorDto instructor) {
        this.instructor = instructor;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getStudentsCount() {
        return studentsCount;
    }

    public void setStudentsCount(int studentsCount) {
        this.studentsCount = studentsCount;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(double originalPrice) {
        this.originalPrice = originalPrice;
    }

    public boolean isEnrolled() {
        return isEnrolled;
    }

    public void setEnrolled(boolean enrolled) {
        isEnrolled = enrolled;
    }

    public String getLastAccessed() {
        return lastAccessed;
    }

    public void setLastAccessed(String lastAccessed) {
        this.lastAccessed = lastAccessed;
    }

    public int getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(int completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public int getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(int totalLessons) {
        this.totalLessons = totalLessons;
    }

    public int getCompletedLessons() {
        return completedLessons;
    }

    public void setCompletedLessons(int completedLessons) {
        this.completedLessons = completedLessons;
    }

    public List<SectionDto> getSections() {
        return sections;
    }

    public void setSections(List<SectionDto> sections) {
        this.sections = sections;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
