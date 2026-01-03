package com.elearning.tutorservice.exception;

public class ZoomOAuthException extends RuntimeException {
    public ZoomOAuthException(String message) {
        super(message);
    }

    public ZoomOAuthException(String message, Throwable cause) {
        super(message, cause);
    }
}
