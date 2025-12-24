package com.elearning.quizservice.dto.response;

import com.elearning.quizservice.entity.Quiz;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for quiz summary (list view)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizSummaryResponse {
    
    private UUID id;
    private UUID classId;
    private UUID creatorId;
    private String title;
    private String description;
    private Integer timeLimitMinutes;
    private Integer totalQuestions;
    private Quiz.QuizStatus status;
    private LocalDateTime publishedAt;
    private LocalDateTime dueDate;
    private Integer passingScore;
    private Integer maxAttempts;
    private Long totalAttempts;
    private Double averagePercentage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
