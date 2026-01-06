package com.elearning.quizservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO for a user's answer to a question
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAnswerResponse {

    private UUID questionId;
    private List<UUID> selectedOptions;
    private LocalDateTime answeredAt;
}
