package com.elearning.classservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity to store Zoom OAuth credentials for each tutor
 * Each tutor can connect their personal Zoom account via OAuth
 */
@Entity
@Table(name = "tutor_zoom_credentials")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorZoomCredential extends BaseEntity {
    
    @Column(name = "tutor_id", nullable = false, unique = true)
    private UUID tutorId;
    
    @Column(name = "access_token", nullable = false, columnDefinition = "TEXT")
    private String accessToken;
    
    @Column(name = "refresh_token", nullable = false, columnDefinition = "TEXT")
    private String refreshToken;
    
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(name = "zoom_user_id")
    private String zoomUserId;
    
    @Column(name = "zoom_email")
    private String zoomEmail;
    
    /**
     * Check if the access token is expired
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
