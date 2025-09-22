package com.elearning.quiz.dto;

public class LessonProgressRequest {
    private Boolean isCompleted;
    private Boolean isCurrent;
    private Boolean isLocked;

    // Constructors
    public LessonProgressRequest() {}

    public LessonProgressRequest(Boolean isCompleted, Boolean isCurrent, Boolean isLocked) {
        this.isCompleted = isCompleted;
        this.isCurrent = isCurrent;
        this.isLocked = isLocked;
    }

    // Getters and Setters
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
