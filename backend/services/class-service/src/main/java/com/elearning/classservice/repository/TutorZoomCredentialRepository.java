package com.elearning.classservice.repository;

import com.elearning.classservice.entity.TutorZoomCredential;
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
}
