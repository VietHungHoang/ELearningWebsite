package com.elearning.chatservice.dto;

import lombok.*;

import java.util.UUID;

/**
 * DTO for user info sent from frontend when creating conversations
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {
    private UUID id;
    private String fullName;
    private String avatarUrl;
}
