package com.elearning.quiz.dto;

public class ProgressDto {
    private int completed;
    private int total;
    private String duration;

    // Constructors
    public ProgressDto() {}

    public ProgressDto(int completed, int total, String duration) {
        this.completed = completed;
        this.total = total;
        this.duration = duration;
    }

    // Getters and Setters
    public int getCompleted() {
        return completed;
    }

    public void setCompleted(int completed) {
        this.completed = completed;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }
}
