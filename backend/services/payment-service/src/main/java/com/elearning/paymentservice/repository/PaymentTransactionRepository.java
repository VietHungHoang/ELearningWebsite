package com.elearning.paymentservice.repository;

import com.elearning.paymentservice.entity.PaymentTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, UUID> {

    Optional<PaymentTransaction> findByOrderId(UUID orderId);

    Optional<PaymentTransaction> findByProviderTransactionId(String providerTransactionId);

    Page<PaymentTransaction> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
}