package com.elearning.courseservice.exception;

public class CourseTitleAlreadyExistsException extends RuntimeException {
    public CourseTitleAlreadyExistsException(String message) {
        super(message);
    }
}
