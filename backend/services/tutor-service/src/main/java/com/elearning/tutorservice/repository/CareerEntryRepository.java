package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.CareerEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CareerEntryRepository extends JpaRepository<CareerEntry, UUID> {
    List<CareerEntry> findByTutorIdOrderByStartDateDesc(UUID tutorId);
}