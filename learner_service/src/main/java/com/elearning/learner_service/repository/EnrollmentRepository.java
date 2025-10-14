package com.elearning.learner_service.repository;

import com.elearning.learner_service.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    Enrollment findByAccountIdAndCourseId(Long accountId, Long courseId);

    List<Enrollment> findByAccountId(Long accountId);
}
