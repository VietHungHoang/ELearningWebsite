package com.elearning.quizservice.exception;

import lombok.Getter;

/**
 * Base exception for quiz service
 */
@Getter
public class QuizServiceException extends RuntimeException {
    
    private final String errorCode;
    
    public QuizServiceException(String message) {
        super(message);
        this.errorCode = "QUIZ_ERROR";
    }
    
    public QuizServiceException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public QuizServiceException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "QUIZ_ERROR";
    }
}
