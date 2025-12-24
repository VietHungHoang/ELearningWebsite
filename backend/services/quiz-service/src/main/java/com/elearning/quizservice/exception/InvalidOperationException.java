package com.elearning.quizservice.exception;

/**
 * Exception thrown when an invalid operation is attempted
 */
public class InvalidOperationException extends QuizServiceException {
    
    public InvalidOperationException(String message) {
        super(message, "INVALID_OPERATION");
    }
    
    public static InvalidOperationException quizNotPublished() {
        return new InvalidOperationException("Quiz is not published yet");
    }
    
    public static InvalidOperationException quizAlreadyPublished() {
        return new InvalidOperationException("Quiz is already published");
    }
    
    public static InvalidOperationException maxAttemptsReached() {
        return new InvalidOperationException("Maximum number of attempts reached");
    }
    
    public static InvalidOperationException attemptAlreadySubmitted() {
        return new InvalidOperationException("This attempt has already been submitted");
    }
    
    public static InvalidOperationException attemptNotInProgress() {
        return new InvalidOperationException("Attempt is not in progress");
    }
    
    public static InvalidOperationException quizExpired() {
        return new InvalidOperationException("Quiz has expired");
    }
    
    public static InvalidOperationException invalidQuestionType() {
        return new InvalidOperationException("Invalid question type for this operation");
    }
}
