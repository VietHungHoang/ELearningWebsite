package com.elearning.chatservice.dto.response;

import lombok.*;

import java.util.UUID;

/**
 * DTO for participant user info in conversation response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantUserInfo {
    private UUID userId;
    private String fullName;
    private String avatarUrl;
}
