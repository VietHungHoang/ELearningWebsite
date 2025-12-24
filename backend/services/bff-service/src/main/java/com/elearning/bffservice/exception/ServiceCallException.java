package com.elearning.bffservice.exception;

/**
 * Custom exception for service call failures
 */
public class ServiceCallException extends RuntimeException {

    public ServiceCallException(String message) {
        super(message);
    }

    public ServiceCallException(String message, Throwable cause) {
        super(message, cause);
    }
}
