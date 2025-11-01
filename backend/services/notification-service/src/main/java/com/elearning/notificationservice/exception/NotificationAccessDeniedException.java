package com.elearning.notificationservice.exception;

public class NotificationAccessDeniedException extends RuntimeException {

    public NotificationAccessDeniedException(String message) {
        super(message);
    }

    public NotificationAccessDeniedException(String message, Throwable cause) {
        super(message, cause);
    }
}