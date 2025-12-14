package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.TutorOnboarding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TutorOnboardingRepository extends JpaRepository<TutorOnboarding, UUID> {
}
