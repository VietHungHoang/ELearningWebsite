package com.elearning.paymentservice.repository;

import com.elearning.paymentservice.entity.PaymentTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
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
}