package com.elearning.quiz.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LessonDto {
    private String id;
    private String sectionId;
    private String courseId;
    private String title;
    private String description;
    private String duration;
    @JsonProperty("isCompleted")
    private Boolean isCompleted;
    @JsonProperty("isCurrent")
    private Boolean isCurrent;
    @JsonProperty("isLocked")
    private Boolean isLocked;
    private String videoUrl;
    private String content;
    private String thumbnail;
    private int orderIndex;

    // Constructors
    public LessonDto() {}

    public LessonDto(String id, String sectionId, String courseId, String title, String description,
                    String duration, Boolean isCompleted, Boolean isCurrent, Boolean isLocked,
                    String videoUrl, String thumbnail, int orderIndex) {
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
        this.thumbnail = thumbnail;
        this.orderIndex = orderIndex;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSectionId() {
        return sectionId;
    }

    public void setSectionId(String sectionId) {
        this.sectionId = sectionId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public Boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(Boolean completed) {
        isCompleted = completed;
    }

    public Boolean isCurrent() {
        return isCurrent;
    }

    public void setCurrent(Boolean current) {
        isCurrent = current;
    }

    public Boolean isLocked() {
        return isLocked;
    }

    public void setLocked(Boolean locked) {
        isLocked = locked;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }
}
