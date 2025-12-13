package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.TutorSocial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TutorSocialRepository extends JpaRepository<TutorSocial, UUID> {
}
