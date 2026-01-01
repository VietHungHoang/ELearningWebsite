package com.elearning.quizservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Event received when a tutor account is approved
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorAccountApprovedEvent {
    private UUID tutorId;
    private String email;
    private String fullName;
    private String avatarUrl;
}
