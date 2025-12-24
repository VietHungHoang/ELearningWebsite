package com.elearning.quizservice.exception;

/**
 * Exception thrown when validation fails
 */
public class ValidationException extends QuizServiceException {
    
    public ValidationException(String message) {
        super(message, "VALIDATION_ERROR");
    }
    
    public static ValidationException noQuestions() {
        return new ValidationException("Quiz must have at least one question");
    }
    
    public static ValidationException noOptions() {
        return new ValidationException("Question must have at least two options");
    }
    
    public static ValidationException noCorrectAnswer() {
        return new ValidationException("Question must have at least one correct answer");
    }
    
    public static ValidationException multipleCorrectAnswersForSingleChoice() {
        return new ValidationException("Single choice question can only have one correct answer");
    }
    
    public static ValidationException invalidOptionSelection() {
        return new ValidationException("Invalid option selection");
    }
}
