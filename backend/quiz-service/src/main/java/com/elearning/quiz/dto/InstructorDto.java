package com.elearning.quiz.dto;

public class InstructorDto {
    private String id;
    private String name;
    private String avatar;
    private String title;
    private String bio;
    private double rating;
    private int totalStudents;
    private int totalCourses;

    // Constructors
    public InstructorDto() {}

    public InstructorDto(String id, String name, String avatar, String title, String bio,
                        double rating, int totalStudents, int totalCourses) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.title = title;
        this.bio = bio;
        this.rating = rating;
        this.totalStudents = totalStudents;
        this.totalCourses = totalCourses;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(int totalStudents) {
        this.totalStudents = totalStudents;
    }

    public int getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(int totalCourses) {
        this.totalCourses = totalCourses;
    }
}
