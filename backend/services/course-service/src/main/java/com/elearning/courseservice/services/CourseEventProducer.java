package com.elearning.courseservice.services;

import com.elearning.courseservice.events.CourseCreatedEvent;

public interface CourseEventProducer {
    public void sendCourseCreatedEvent(CourseCreatedEvent event);
}