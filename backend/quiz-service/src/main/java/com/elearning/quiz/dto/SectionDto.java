package com.elearning.quiz.dto;

import java.util.List;

public class SectionDto {
    private String id;
    private String courseId;
    private String title;
    private Boolean isExpanded;
    private ProgressDto progress;
    private QuizDto quiz;
    private Boolean quizCompleted;
    private Boolean isUnlocked;
    private List<LessonDto> lessons;

    // Constructors
    public SectionDto() {}

    public SectionDto(String id, String courseId, String title, Boolean isExpanded,
                     ProgressDto progress, QuizDto quiz, Boolean quizCompleted,
                     Boolean isUnlocked, List<LessonDto> lessons) {
        this.id = id;
        this.courseId = courseId;
        this.title = title;
        this.isExpanded = isExpanded;
        this.progress = progress;
        this.quiz = quiz;
        this.quizCompleted = quizCompleted;
        this.isUnlocked = isUnlocked;
        this.lessons = lessons;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Boolean isExpanded() {
        return isExpanded;
    }

    public void setExpanded(Boolean expanded) {
        isExpanded = expanded;
    }

    public ProgressDto getProgress() {
        return progress;
    }

    public void setProgress(ProgressDto progress) {
        this.progress = progress;
    }

    public QuizDto getQuiz() {
        return quiz;
    }

    public void setQuiz(QuizDto quiz) {
        this.quiz = quiz;
    }

    public Boolean isQuizCompleted() {
        return quizCompleted;
    }

    public void setQuizCompleted(Boolean quizCompleted) {
        this.quizCompleted = quizCompleted;
    }

    public Boolean isUnlocked() {
        return isUnlocked;
    }

    public void setUnlocked(Boolean unlocked) {
        isUnlocked = unlocked;
    }

    public List<LessonDto> getLessons() {
        return lessons;
    }

    public void setLessons(List<LessonDto> lessons) {
        this.lessons = lessons;
    }
}
