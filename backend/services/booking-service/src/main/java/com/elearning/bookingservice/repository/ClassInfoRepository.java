package com.elearning.bookingservice.repository;

import com.elearning.bookingservice.entity.ClassInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassInfoRepository extends JpaRepository<ClassInfo, UUID> {

    Optional<ClassInfo> findByClassId(UUID classId);
}
