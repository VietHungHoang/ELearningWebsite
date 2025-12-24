package com.elearning.paymentservice.service.impl;

import com.elearning.paymentservice.dto.event.BookingPaymentFailedEvent;
import com.elearning.paymentservice.dto.event.BookingPaymentSuccessEvent;
import com.elearning.paymentservice.dto.event.PaymentCompletedEvent;
import com.elearning.paymentservice.dto.event.PaymentFailedEvent;
import com.elearning.paymentservice.dto.request.ConfirmPaymentRequest;
import com.elearning.paymentservice.dto.request.InitiatePaymentRequest;
import com.elearning.paymentservice.dto.response.InitiatePaymentResponse;
import com.elearning.paymentservice.dto.response.PaymentData;
import com.elearning.paymentservice.dto.response.PaymentHistoryItem;
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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        
        GatewayCreationResponse response;
        try {
            var strategy = paymentGatewayFactory.getStrategy(request.getPaymentProvider());
            response = strategy.createPaymentIntent(request);
        } catch (Exception e) {
            log.error("Failed to create payment intent for orderId: {}, provider: {}", request.getOrderId(), request.getPaymentProvider(), e);
            throw new RuntimeException("Payment gateway error: " + e.getMessage(), e);
        }

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

    @Override
    @Transactional
    public void confirmPayment(ConfirmPaymentRequest request) {
        log.info("Confirming payment for orderId: {}", request.getOrderId());

        // Find the transaction by orderId
        Optional<PaymentTransaction> transactionOpt = paymentTransactionRepository.findByOrderId(request.getOrderId());

        if (transactionOpt.isEmpty()) {
            log.warn("No transaction found for orderId: {}", request.getOrderId());
            throw new IllegalArgumentException("Transaction not found for orderId: " + request.getOrderId());
        }

        PaymentTransaction transaction = transactionOpt.get();

        // Update transaction with response data
        transaction.setPartnerCode(request.getPartnerCode());
        transaction.setOrderInfo(request.getOrderInfo());
        transaction.setOrderType(request.getOrderType());
        transaction.setResultCode(request.getResultCode());
        transaction.setResultMessage(request.getMessage());
        transaction.setPayType(request.getPayType());
        transaction.setSignature(request.getSignature());

        // Parse responseTime if provided
        if (request.getResponseTime() != null) {
            try {
                transaction.setResponseTime(java.time.LocalDateTime.parse(request.getResponseTime().replace("Z", "")));
            } catch (Exception e) {
                log.warn("Failed to parse responseTime: {}", request.getResponseTime());
            }
        }

        // Determine status based on resultCode
        PaymentStatus newStatus;
        LocalDateTime eventTime = LocalDateTime.now();

        if ("0".equals(request.getResultCode())) {
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

        } else {
            newStatus = PaymentStatus.FAILED;

            // Publish payment failed event
            PaymentFailedEvent event = PaymentFailedEvent.builder()
                .paymentId(transaction.getId())
                .orderId(transaction.getOrderId())
                .amount(transaction.getAmount())
                .currency(transaction.getCurrency())
                .paymentProvider(transaction.getProvider().name())
                .providerTransactionId(transaction.getProviderTransactionId())
                .failureReason("Payment failed with resultCode: " + request.getResultCode() + ", message: " + request.getMessage())
                .failedAt(eventTime)
                .build();

            kafkaProducer.sendPaymentFailedEvent(event);
            log.info("Published payment failed event for order: {}", transaction.getOrderId());
        }

        // Update and save transaction
        transaction.setStatus(newStatus);
        transaction.setUpdatedAt(eventTime);
        paymentTransactionRepository.save(transaction);

        log.info("Updated transaction {} status to {} based on resultCode: {}", transaction.getId(), newStatus, request.getResultCode());
    }

    @Override
    public Page<PaymentHistoryItem> getPaymentHistory(UUID userId, Pageable pageable) {
        Page<PaymentTransaction> transactions = paymentTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return transactions.map(transaction -> PaymentHistoryItem.builder()
                .id(transaction.getId().toString())
                .date(transaction.getCreatedAt().toString())
                .amount(transaction.getAmount())
                .method(transaction.getProvider())
                .status(transaction.getStatus())
                .build());
    }

    @Override
    @Transactional
    public void handlePaymentSuccess(UUID bookingId) {
        log.info("Handling payment success for bookingId: {}", bookingId);

        // Find payment transaction by orderId (bookingId)
        Optional<PaymentTransaction> optionalTransaction = paymentTransactionRepository.findByOrderId(bookingId);
        
        if (optionalTransaction.isEmpty()) {
            log.error("Payment transaction not found for bookingId: {}", bookingId);
            throw new RuntimeException("Payment transaction not found for booking: " + bookingId);
        }

        PaymentTransaction transaction = optionalTransaction.get();

        // Update payment status to COMPLETED
        transaction.setStatus(PaymentStatus.COMPLETED);
        transaction.setPaidAt(LocalDateTime.now());
        paymentTransactionRepository.save(transaction);

        log.info("Updated payment transaction status to COMPLETED for bookingId: {}", bookingId);

        // Send Kafka event to class-service and booking-service
        BookingPaymentSuccessEvent event = BookingPaymentSuccessEvent.builder()
                .bookingId(bookingId)
                .classId(null) // Will be populated by booking-service
                .build();

        kafkaProducer.sendBookingPaymentSuccessEvent(event);
        log.info("Sent BookingPaymentSuccessEvent for bookingId: {}", bookingId);
    }

    @Override
    @Transactional
    public void handlePaymentError(UUID bookingId) {
        log.info("Handling payment error for bookingId: {}", bookingId);

        // Find payment transaction by orderId (bookingId)
        Optional<PaymentTransaction> optionalTransaction = paymentTransactionRepository.findByOrderId(bookingId);
        
        if (optionalTransaction.isEmpty()) {
            log.error("Payment transaction not found for bookingId: {}", bookingId);
            throw new RuntimeException("Payment transaction not found for booking: " + bookingId);
        }

        PaymentTransaction transaction = optionalTransaction.get();

        // Update payment status to FAILED
        transaction.setStatus(PaymentStatus.FAILED);
        paymentTransactionRepository.save(transaction);

        log.info("Updated payment transaction status to FAILED for bookingId: {}", bookingId);

        // Send Kafka event to class-service (for rollback) and booking-service
        BookingPaymentFailedEvent event = BookingPaymentFailedEvent.builder()
                .bookingId(bookingId)
                .classId(null) // Will be populated by booking-service
                .reason("Payment failed or cancelled by user")
                .build();

        kafkaProducer.sendBookingPaymentFailedEvent(event);
        log.info("Sent BookingPaymentFailedEvent for bookingId: {}", bookingId);
    }
}