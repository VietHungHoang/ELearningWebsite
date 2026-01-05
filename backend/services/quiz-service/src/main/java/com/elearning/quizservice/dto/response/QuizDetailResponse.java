package com.elearning.quizservice.dto.response;

import com.elearning.quizservice.entity.Quiz;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO for quiz details
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizDetailResponse {
    
    private UUID id;
    private UUID classId;
    private String classTitle;
    private UUID creatorId;
    private String creatorName;
    private String creatorAvatar;
    private String title;
    private String description;
    private Integer timeLimitMinutes;
    private Integer totalQuestions;
    private Quiz.QuizStatus status;
    private LocalDateTime publishedAt;
    private LocalDateTime dueDate;
    private Integer passingScore;
    private Boolean shuffleQuestions;
    private Boolean showCorrectAnswers;
    private Integer maxAttempts;
    private List<QuestionResponse> questions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
