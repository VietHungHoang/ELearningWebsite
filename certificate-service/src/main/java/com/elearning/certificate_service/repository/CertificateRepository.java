package com.elearning.certificate_service.repository;

import com.elearning.certificate_service.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByLearnerIdAndCourseId(Long learnerId, Long courseId);

    List<Certificate> findByLearnerId(Long learnerId);
}
