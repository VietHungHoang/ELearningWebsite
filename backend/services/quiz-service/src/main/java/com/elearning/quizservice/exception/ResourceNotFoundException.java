package com.elearning.quizservice.exception;

/**
 * Exception thrown when a resource is not found
 */
public class ResourceNotFoundException extends QuizServiceException {
    
    public ResourceNotFoundException(String message) {
        super(message, "RESOURCE_NOT_FOUND");
    }
    
    public static ResourceNotFoundException quiz(String quizId) {
        return new ResourceNotFoundException("Quiz not found with ID: " + quizId);
    }
    
    public static ResourceNotFoundException question(String questionId) {
        return new ResourceNotFoundException("Question not found with ID: " + questionId);
    }
    
    public static ResourceNotFoundException attempt(String attemptId) {
        return new ResourceNotFoundException("Quiz attempt not found with ID: " + attemptId);
    }
    
    public static ResourceNotFoundException option(String optionId) {
        return new ResourceNotFoundException("Question option not found with ID: " + optionId);
    }
}
