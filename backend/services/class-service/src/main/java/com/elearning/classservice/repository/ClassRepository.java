package com.elearning.classservice.repository;

import com.elearning.classservice.entity.ClassEntity;
import com.elearning.classservice.entity.enums.ClassStatus;
import com.elearning.classservice.entity.enums.ClassType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClassRepository extends JpaRepository<ClassEntity, UUID> {
    Page<ClassEntity> findByTutorId(UUID tutorId, Pageable pageable);
    List<ClassEntity> findByTutorId(UUID tutorId);
    Page<ClassEntity> findByStatus(ClassStatus status, Pageable pageable);
    Page<ClassEntity> findByClassType(ClassType classType, Pageable pageable);
    List<ClassEntity> findByTutorIdAndStatus(UUID tutorId, ClassStatus status);
}
