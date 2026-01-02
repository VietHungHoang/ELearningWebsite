package com.elearning.bookingservice.repository;

import com.elearning.bookingservice.entity.Discount;
import com.elearning.bookingservice.entity.DiscountScope;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, UUID> {

    Optional<Discount> findByCode(String code);

    Optional<Discount> findByCodeAndIsActiveTrue(String code);

    Page<Discount> findByCreatedByOrderByCreatedAtDesc(UUID createdBy, Pageable pageable);

    Page<Discount> findByScopeOrderByCreatedAtDesc(DiscountScope scope, Pageable pageable);

    Page<Discount> findByCreatedByAndIsActiveOrderByCreatedAtDesc(UUID createdBy, Boolean isActive, Pageable pageable);

    boolean existsByCode(String code);
}
