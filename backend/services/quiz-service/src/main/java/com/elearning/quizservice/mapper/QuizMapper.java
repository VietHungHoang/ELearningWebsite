package com.elearning.quizservice.mapper;

import com.elearning.quizservice.dto.response.QuizAttemptResponse;
import com.elearning.quizservice.dto.response.QuizDetailResponse;
import com.elearning.quizservice.dto.response.QuizSummaryResponse;
import com.elearning.quizservice.entity.Quiz;
import com.elearning.quizservice.entity.QuizAttempt;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Mapper for Quiz entity and DTOs
 */
@Component
@RequiredArgsConstructor
public class QuizMapper {
    
    /**
     * Map Quiz entity to QuizSummaryResponse
     */
    public QuizSummaryResponse toSummaryResponse(Quiz quiz) {
        return QuizSummaryResponse.builder()
                .id(quiz.getId())
                .classId(quiz.getClassId())
                .classTitle(quiz.getClassInfo() != null ? quiz.getClassInfo().getTitle() : null)
                .creatorId(quiz.getCreatorId())
                .creatorName(quiz.getCreator() != null ? quiz.getCreator().getFullName() : null)
                .creatorAvatar(quiz.getCreator() != null ? quiz.getCreator().getAvatarUrl() : null)
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .timeLimitMinutes(quiz.getTimeLimitMinutes())
                .totalQuestions(quiz.getTotalQuestions())
                .status(quiz.getStatus())
                .publishedAt(quiz.getPublishedAt())
                .dueDate(quiz.getDueDate())
                .passingScore(quiz.getPassingScore())
                .maxAttempts(quiz.getMaxAttempts())
                .createdAt(quiz.getCreatedAt())
                .updatedAt(quiz.getUpdatedAt())
                .build();
    }
    
    /**
     * Map Quiz entity to QuizSummaryResponse with statistics
     */
    public QuizSummaryResponse toSummaryResponse(Quiz quiz, Long totalAttempts, Double avgPercentage) {
        QuizSummaryResponse response = toSummaryResponse(quiz);
        response.setTotalAttempts(totalAttempts);
        response.setAveragePercentage(avgPercentage);
        return response;
    }
    
    /**
     * Map Quiz entity to QuizSummaryResponse with full statistics
     */
    public QuizSummaryResponse toSummaryResponse(Quiz quiz, Long totalAttempts, Double avgPercentage, Double highestScore) {
        QuizSummaryResponse response = toSummaryResponse(quiz, totalAttempts, avgPercentage);
        response.setHighestScore(highestScore);
        return response;
    }
    
    /**
     * Map Quiz entity to QuizDetailResponse
     */
    public QuizDetailResponse toDetailResponse(Quiz quiz) {
        return QuizDetailResponse.builder()
                .id(quiz.getId())
                .classId(quiz.getClassId())
                .classTitle(quiz.getClassInfo() != null ? quiz.getClassInfo().getTitle() : null)
                .creatorId(quiz.getCreatorId())
                .creatorName(quiz.getCreator() != null ? quiz.getCreator().getFullName() : null)
                .creatorAvatar(quiz.getCreator() != null ? quiz.getCreator().getAvatarUrl() : null)
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .timeLimitMinutes(quiz.getTimeLimitMinutes())
                .totalQuestions(quiz.getTotalQuestions())
                .status(quiz.getStatus())
                .publishedAt(quiz.getPublishedAt())
                .dueDate(quiz.getDueDate())
                .passingScore(quiz.getPassingScore())
                .shuffleQuestions(quiz.getShuffleQuestions())
                .showCorrectAnswers(quiz.getShowCorrectAnswers())
                .maxAttempts(quiz.getMaxAttempts())
                .createdAt(quiz.getCreatedAt())
                .updatedAt(quiz.getUpdatedAt())
                .build();
    }
    
    /**
     * Map QuizAttempt entity to QuizAttemptResponse
     */
    public QuizAttemptResponse toAttemptResponse(QuizAttempt attempt) {
        return QuizAttemptResponse.builder()
                .id(attempt.getId())
                .quizId(attempt.getQuiz().getId())
                .studentId(attempt.getStudentId())
                .attemptNumber(attempt.getAttemptNumber())
                .status(attempt.getStatus())
                .startedAt(attempt.getStartedAt())
                .submittedAt(attempt.getSubmittedAt())
                .correctAnswers(attempt.getCorrectAnswers())
                .totalQuestions(attempt.getTotalQuestions())
                .percentage(attempt.getPercentage())
                .passed(attempt.getPassed())
                .createdAt(attempt.getCreatedAt())
                .build();
    }
}
