package com.elearning.quizservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * User entity for storing synced user information (tutor/student).
 * This entity stores minimal user info needed for display purposes.
 * Data will be synced from User Service in the future.
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    private UUID id;
    
    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
}
