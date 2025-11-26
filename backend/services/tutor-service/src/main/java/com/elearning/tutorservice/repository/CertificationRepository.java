package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CertificationRepository extends JpaRepository<Certification, UUID> {
    List<Certification> findByTutorId(UUID tutorId);
}