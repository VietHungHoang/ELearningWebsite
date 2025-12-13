package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.TutorLanguage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TutorLanguageRepository extends JpaRepository<TutorLanguage, UUID> {
}
