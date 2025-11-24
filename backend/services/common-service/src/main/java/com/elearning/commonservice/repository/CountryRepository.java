package com.elearning.commonservice.repository;

import com.elearning.commonservice.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CountryRepository extends JpaRepository<Country, UUID> {
}