package com.elearning.classservice.repository;

import com.elearning.classservice.entity.ClassMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClassMaterialRepository extends JpaRepository<ClassMaterial, UUID> {
    List<ClassMaterial> findByClassEntityIdOrderByUploadDateDesc(UUID classId);
}
