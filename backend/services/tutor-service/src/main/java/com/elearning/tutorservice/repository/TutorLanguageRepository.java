package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.TutorLanguage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface TutorLanguageRepository extends JpaRepository<TutorLanguage, UUID> {
    
    @Modifying
    @Query("DELETE FROM TutorLanguage tl WHERE tl.tutor.id = :tutorId")
    void deleteByTutorId(@Param("tutorId") UUID tutorId);
}
