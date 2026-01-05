package com.elearning.chatservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * UserCache entity - caches user info (name, avatar) from user-service
 * to avoid cross-service calls when displaying conversation participants
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_cache")
public class UserCache {

    @Id
    private UUID id; // Same as user ID from user-service

    private String fullName;

    private String avatarUrl;

    private LocalDateTime updatedAt;
}
