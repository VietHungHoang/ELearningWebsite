package com.elearning.classservice.exception;

public class ZoomOAuthException extends RuntimeException {
    public ZoomOAuthException(String message) {
        super(message);
    }

    public ZoomOAuthException(String message, Throwable cause) {
        super(message, cause);
    }
}
