package com.elearning.contentservice.service;

import com.elearning.contentservice.events.CourseCreatedEvent;

public interface CourseEventListener {
    public void handleCourseCreatedEvent(CourseCreatedEvent event);
}