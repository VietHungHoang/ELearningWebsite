package com.elearning.studentservice.repository;

import com.elearning.studentservice.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {
    Optional<Student> findByEmail(String email);
    boolean existsByEmail(String email);
    Page<Student> findAll(Pageable pageable);
}
