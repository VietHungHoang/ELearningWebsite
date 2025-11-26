package com.elearning.classservice.exception;

public class ZoomApiException extends RuntimeException {
    public ZoomApiException(String message) {
        super(message);
    }

    public ZoomApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
