package com.elearning.commonservice.repository;

import com.elearning.commonservice.entity.Timezone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TimezoneRepository extends JpaRepository<Timezone, UUID> {
}