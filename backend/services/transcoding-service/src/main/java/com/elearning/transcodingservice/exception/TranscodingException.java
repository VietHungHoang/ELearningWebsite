package com.elearning.transcodingservice.exception;

/**
 * Exception thrown when transcoding process fails
 */
public class TranscodingException extends RuntimeException {
    
    public TranscodingException(String message) {
        super(message);
    }
    
    public TranscodingException(String message, Throwable cause) {
        super(message, cause);
    }
}