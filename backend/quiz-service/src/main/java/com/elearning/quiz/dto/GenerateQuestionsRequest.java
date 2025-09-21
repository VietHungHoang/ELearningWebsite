package com.elearning.quiz.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class GenerateQuestionsRequest {
    
    @NotBlank(message = "Topic is required")
    @Size(max = 500, message = "Topic must not exceed 500 characters")
    private String topic;
    
    @NotBlank(message = "Content is required")
    @Size(max = 2000, message = "Content must not exceed 2000 characters")
    private String content;
    
    @Min(value = 1, message = "Number of questions must be at least 1")
    @Max(value = 20, message = "Number of questions must not exceed 20")
    private Integer numberOfQuestions = 5;
    
    @NotNull(message = "Question types are required")
    private List<QuestionType> questionTypes;
    
    @Min(value = 1, message = "Difficulty level must be at least 1")
    @Max(value = 5, message = "Difficulty level must not exceed 5")
    private Integer difficultyLevel = 3;
    
    private String language = "Vietnamese";
    
    // Question types enum
    public enum QuestionType {
        MULTIPLE_CHOICE("Multiple Choice"),
        TRUE_FALSE("True/False"),
        FILL_IN_BLANK("Fill in the Blank"),
        SHORT_ANSWER("Short Answer");
        
        private final String displayName;
        
        QuestionType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Constructors
    public GenerateQuestionsRequest() {}
    
    public GenerateQuestionsRequest(String topic, String content, Integer numberOfQuestions, 
                                  List<QuestionType> questionTypes, Integer difficultyLevel, String language) {
        this.topic = topic;
        this.content = content;
        this.numberOfQuestions = numberOfQuestions;
        this.questionTypes = questionTypes;
        this.difficultyLevel = difficultyLevel;
        this.language = language;
    }
    
    // Getters and Setters
    public String getTopic() {
        return topic;
    }
    
    public void setTopic(String topic) {
        this.topic = topic;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Integer getNumberOfQuestions() {
        return numberOfQuestions;
    }
    
    public void setNumberOfQuestions(Integer numberOfQuestions) {
        this.numberOfQuestions = numberOfQuestions;
    }
    
    public List<QuestionType> getQuestionTypes() {
        return questionTypes;
    }
    
    public void setQuestionTypes(List<QuestionType> questionTypes) {
        this.questionTypes = questionTypes;
    }
    
    public Integer getDifficultyLevel() {
        return difficultyLevel;
    }
    
    public void setDifficultyLevel(Integer difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }
    
    public String getLanguage() {
        return language;
    }
    
    public void setLanguage(String language) {
        this.language = language;
    }
    
    @Override
    public String toString() {
        return "GenerateQuestionsRequest{" +
                "topic='" + topic + '\'' +
                ", content='" + content + '\'' +
                ", numberOfQuestions=" + numberOfQuestions +
                ", questionTypes=" + questionTypes +
                ", difficultyLevel=" + difficultyLevel +
                ", language='" + language + '\'' +
                '}';
    }
}
