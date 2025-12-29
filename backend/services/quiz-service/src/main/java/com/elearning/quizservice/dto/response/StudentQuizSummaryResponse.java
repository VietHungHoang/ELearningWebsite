package com.elearning.quizservice.dto.response;

import com.elearning.quizservice.entity.StudentQuizStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for student's quiz list view.
 * Contains quiz info combined with student's attempt status and progress.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentQuizSummaryResponse {
    
    // Quiz info
    private UUID id;
    private String title;
    private String description;
    private Integer totalQuestions;
    private Integer timeLimitMinutes;
    private Integer passingScore;
    private LocalDateTime dueDate;
    
    // Student's status for this quiz
    private StudentQuizStatus studentStatus;
    
    // Tutor info (from User entity)
    private String tutorName;
    private String tutorAvatar;
    
    // Attempt info (nullable if not started)
    private UUID currentAttemptId;
    private Integer questionsAnswered;
    private Integer timeRemainingSeconds;
    
    // Completed attempt info
    private Integer score;
    private Integer maxScore;
    private Double percentage;
    private Boolean passed;
    private LocalDateTime completedAt;
    
    // Timestamps
    private LocalDateTime assignedAt;
    private LocalDateTime createdAt;
}
