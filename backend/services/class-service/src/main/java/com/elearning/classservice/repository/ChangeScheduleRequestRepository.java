package com.elearning.classservice.repository;

import com.elearning.classservice.entity.ChangeScheduleRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChangeScheduleRequestRepository extends JpaRepository<ChangeScheduleRequestEntity, UUID> {
}