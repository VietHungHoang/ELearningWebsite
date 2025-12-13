package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.TutorSubject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TutorSubjectRepository extends JpaRepository<TutorSubject, UUID> {
}
