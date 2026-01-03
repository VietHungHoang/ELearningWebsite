package com.elearning.bookingservice.repository;

import com.elearning.bookingservice.entity.DiscountUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DiscountUsageRepository extends JpaRepository<DiscountUsage, UUID> {

    long countByDiscountIdAndUserId(UUID discountId, UUID userId);

    boolean existsByDiscountIdAndBookingId(UUID discountId, UUID bookingId);
}
