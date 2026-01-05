package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.TutorZoomCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TutorZoomCredentialRepository extends JpaRepository<TutorZoomCredential, UUID> {
    
    /**
     * Find Zoom credentials by tutor ID
     */
    Optional<TutorZoomCredential> findByTutorId(UUID tutorId);
    
    /**
     * Check if tutor has connected Zoom account
     */
    boolean existsByTutorId(UUID tutorId);
    
    /**
     * Delete credentials by tutor ID (disconnect)
     */
    void deleteByTutorId(UUID tutorId);
    
    /**
     * Find any one Zoom credential with non-null accessToken
     * Used to clone credentials for new tutors
     */
    Optional<TutorZoomCredential> findFirstByAccessTokenIsNotNull();
}
