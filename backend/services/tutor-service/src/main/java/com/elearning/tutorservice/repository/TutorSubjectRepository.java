package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.TutorSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface TutorSubjectRepository extends JpaRepository<TutorSubject, UUID> {
    
    @Modifying
    @Query("DELETE FROM TutorSubject ts WHERE ts.tutor.id = :tutorId")
    void deleteByTutorId(@Param("tutorId") UUID tutorId);
}
