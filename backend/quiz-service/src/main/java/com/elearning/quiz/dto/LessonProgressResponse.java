package com.elearning.quiz.dto;

public class LessonProgressResponse {
    private boolean success;
    private String message;
    private String lessonId;
    private Boolean isCompleted;
    private Boolean isCurrent;
    private Boolean isLocked;

    // Constructors
    public LessonProgressResponse() {}

    public LessonProgressResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getLessonId() {
        return lessonId;
    }

    public void setLessonId(String lessonId) {
        this.lessonId = lessonId;
    }

    public Boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public Boolean getIsCurrent() {
        return isCurrent;
    }

    public void setIsCurrent(Boolean isCurrent) {
        this.isCurrent = isCurrent;
    }

    public Boolean getIsLocked() {
        return isLocked;
    }

    public void setIsLocked(Boolean isLocked) {
        this.isLocked = isLocked;
    }

    // Convenience methods
    public boolean isCompleted() {
        return isCompleted != null && isCompleted;
    }

    public boolean isCurrent() {
        return isCurrent != null && isCurrent;
    }

    public boolean isLocked() {
        return isLocked != null && isLocked;
    }
}
