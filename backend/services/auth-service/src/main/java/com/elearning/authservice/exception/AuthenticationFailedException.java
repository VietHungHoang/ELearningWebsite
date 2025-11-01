package com.elearning.authservice.exception;

import org.springframework.http.HttpStatusCode;

public class AuthenticationFailedException extends RuntimeException {
    private final HttpStatusCode status;
    private final String errorDetails;

    public AuthenticationFailedException(String message, HttpStatusCode status, String errorDetails) {
        super(message);
        this.status = status;
        this.errorDetails = errorDetails;
    }

    public HttpStatusCode getStatus() {
        return status;
    }

    public String getErrorDetails() {
        return errorDetails;
    }
}