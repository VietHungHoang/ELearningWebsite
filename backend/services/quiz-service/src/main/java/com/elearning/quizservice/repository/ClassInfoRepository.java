package com.elearning.quizservice.repository;

import com.elearning.quizservice.entity.ClassInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ClassInfoRepository extends JpaRepository<ClassInfo, UUID> {
}
