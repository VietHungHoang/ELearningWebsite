package com.elearning.paymentservice.repository;

import com.elearning.paymentservice.entity.PaymentTransaction;
import com.elearning.paymentservice.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, UUID> {

    Optional<PaymentTransaction> findByOrderId(UUID orderId);

    /**
     * Find transaction by orderId with pessimistic lock to prevent race conditions.
     * Use this when updating payment status to avoid duplicate Kafka events.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM PaymentTransaction p WHERE p.orderId = :orderId")
    Optional<PaymentTransaction> findByOrderIdWithLock(@Param("orderId") UUID orderId);

    Optional<PaymentTransaction> findByProviderTransactionId(String providerTransactionId);

    Page<PaymentTransaction> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM PaymentTransaction p " +
            "WHERE p.status = :status AND p.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByStatusAndCreatedAtBetween(
            @Param("status") PaymentStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT DATE(p.createdAt) as date, COALESCE(SUM(p.amount), 0) as amount " +
            "FROM PaymentTransaction p " +
            "WHERE p.status = :status AND p.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY DATE(p.createdAt) " +
            "ORDER BY DATE(p.createdAt)")
    List<Object[]> findRevenueByDate(
            @Param("status") PaymentStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}