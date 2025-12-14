package com.elearning.paymentservice.service.impl;

import com.elearning.paymentservice.dto.event.PaymentCompletedEvent;
import com.elearning.paymentservice.dto.event.PaymentFailedEvent;
import com.elearning.paymentservice.dto.request.InitiatePaymentRequest;
import com.elearning.paymentservice.dto.response.InitiatePaymentResponse;
import com.elearning.paymentservice.dto.response.PaymentData;
import com.elearning.paymentservice.enums.PaymentMethodType;
import com.elearning.paymentservice.enums.PaymentStatus;
import com.elearning.paymentservice.kafka.KafkaProducer;
import com.elearning.paymentservice.mapper.PaymentMapper;
import com.elearning.paymentservice.entity.PaymentTransaction;
import com.elearning.paymentservice.repository.PaymentTransactionRepository;
import com.elearning.paymentservice.service.PaymentService;
import com.elearning.paymentservice.strategy.PaymentGatewayFactory;
import com.elearning.paymentservice.strategy.dto.GatewayCreationResponse;
import com.elearning.paymentservice.strategy.dto.StandardizedPaymentResult;
import com.elearning.paymentservice.strategy.dto.WebhookPayload;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final PaymentGatewayFactory paymentGatewayFactory;
    private final KafkaProducer kafkaProducer;

    @Override
    @Transactional
    public InitiatePaymentResponse initiatePayment(InitiatePaymentRequest request) {
        log.info("Initiating payment for orderId: {}", request.getOrderId());

        Optional<PaymentTransaction> existingTransaction = paymentTransactionRepository.findByOrderId(request.getOrderId());

        if (existingTransaction.isPresent()) {
            PaymentTransaction transaction = existingTransaction.get();
            log.info("Found existing transaction for orderId: {}, returning existing paymentUrl", request.getOrderId());
            String existingUrl = null;
            if (transaction.getProviderTransactionId() != null) {
                existingUrl = request.getRedirectUrl() + "?tx=" + transaction.getProviderTransactionId();
            }
            PaymentData existingPaymentData = PaymentData.builder()
                .redirectUrl(existingUrl)
                .qrCodeContent(null)
                .sdkParameters(null)
                .build();

            return InitiatePaymentResponse.builder()
                .paymentId(transaction.getId())
                .provider(request.getPaymentProvider())
                .status("PENDING")
                .paymentMethodType(PaymentMethodType.REDIRECT)
                .paymentData(existingPaymentData)
                .build();
        }

        var strategy = paymentGatewayFactory.getStrategy(request.getPaymentProvider());
        GatewayCreationResponse response = strategy.createPaymentIntent(request);

        // Create and save transaction only if gateway call succeeds
        PaymentTransaction newTransaction = PaymentMapper.toEntity(request);
        newTransaction.setProviderTransactionId(response.getProviderTransactionId());
        PaymentTransaction savedTransaction = paymentTransactionRepository.save(newTransaction);
        log.info("Created new payment transaction with id: {} for orderId: {}", savedTransaction.getId(), request.getOrderId());

        // Build richer response for the client
        PaymentData paymentData = PaymentData.builder()
            .redirectUrl(response.getPaymentUrl())
            .qrCodeContent(null)
            .sdkParameters(null)
            .build();

        return InitiatePaymentResponse.builder()
            .paymentId(savedTransaction.getId())
            .provider(request.getPaymentProvider())
            .status("PENDING")
            .paymentMethodType(PaymentMethodType.REDIRECT)
            .paymentData(paymentData)
            .build();
    }

    @Override
    @Transactional
    public void processWebhook(WebhookPayload payload) {
        log.info("Processing webhook for provider transaction: {}", payload.getProviderTransactionId());

        // Find the transaction by provider transaction ID
        Optional<PaymentTransaction> transactionOpt = paymentTransactionRepository
            .findByProviderTransactionId(payload.getProviderTransactionId());

        if (transactionOpt.isEmpty()) {
            log.warn("No transaction found for provider transaction ID: {}", payload.getProviderTransactionId());
            return;
        }

        PaymentTransaction transaction = transactionOpt.get();

        // Get the appropriate strategy for this payment provider
        var strategy = paymentGatewayFactory.getStrategy(transaction.getProvider());

        // Process the webhook using the strategy
        StandardizedPaymentResult result = strategy.handleWebhook(payload);

        // Update transaction status based on webhook result
        PaymentStatus newStatus;
        LocalDateTime eventTime = LocalDateTime.now();

        if ("SUCCESS".equalsIgnoreCase(result.getStatus())) {
            newStatus = PaymentStatus.COMPLETED;
            transaction.setPaidAt(eventTime);

            // Publish payment completed event
            PaymentCompletedEvent event = PaymentCompletedEvent.builder()
                .paymentId(transaction.getId())
                .orderId(transaction.getOrderId())
                .amount(transaction.getAmount())
                .currency(transaction.getCurrency())
                .paymentProvider(transaction.getProvider().name())
                .providerTransactionId(transaction.getProviderTransactionId())
                .completedAt(eventTime)
                .build();

            kafkaProducer.sendPaymentCompletedEvent(event);
            log.info("Published payment completed event for order: {}", transaction.getOrderId());

        } else if ("FAILED".equalsIgnoreCase(result.getStatus())) {
            newStatus = PaymentStatus.FAILED;

            // Publish payment failed event
            PaymentFailedEvent event = PaymentFailedEvent.builder()
                .paymentId(transaction.getId())
                .orderId(transaction.getOrderId())
                .amount(transaction.getAmount())
                .currency(transaction.getCurrency())
                .paymentProvider(transaction.getProvider().name())
                .providerTransactionId(transaction.getProviderTransactionId())
                .failureReason("Payment failed via webhook")
                .failedAt(eventTime)
                .build();

            kafkaProducer.sendPaymentFailedEvent(event);
            log.info("Published payment failed event for order: {}", transaction.getOrderId());

        } else {
            log.info("Webhook status {} not requiring status change for transaction: {}", result.getStatus(), transaction.getId());
            return;
        }

        // Update and save transaction
        transaction.setStatus(newStatus);
        transaction.setUpdatedAt(eventTime);
        paymentTransactionRepository.save(transaction);

        log.info("Updated transaction {} status to {}", transaction.getId(), newStatus);
    }
}