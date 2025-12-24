package com.elearning.paymentservice.entity;

import com.elearning.paymentservice.enums.PaymentGateway;
import com.elearning.paymentservice.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payment_transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", nullable = false)
    private PaymentGateway provider;

    @Column(name = "provider_transaction_id")
    private String providerTransactionId;

    @Column(name = "order_id", nullable = false)
    private UUID orderId;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "partner_code")
    private String partnerCode;

    @Column(name = "order_info")
    private String orderInfo;

    @Column(name = "order_type")
    private String orderType;

    @Column(name = "result_code")
    private String resultCode;

    @Column(name = "result_message")
    private String resultMessage;

    @Column(name = "pay_type")
    private String payType;

    @Column(name = "response_time")
    private LocalDateTime responseTime;

    @Column(name = "signature")
    private String signature;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}