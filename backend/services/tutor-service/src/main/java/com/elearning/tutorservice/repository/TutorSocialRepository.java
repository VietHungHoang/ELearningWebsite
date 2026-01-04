package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.TutorSocial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface TutorSocialRepository extends JpaRepository<TutorSocial, UUID> {
    
    @Modifying
    @Query("DELETE FROM TutorSocial ts WHERE ts.tutor.id = :tutorId")
    void deleteByTutorId(@Param("tutorId") UUID tutorId);
}
