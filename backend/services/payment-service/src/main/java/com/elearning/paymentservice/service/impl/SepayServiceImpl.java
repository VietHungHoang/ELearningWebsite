package com.elearning.paymentservice.service.impl;

import com.elearning.paymentservice.dto.event.BookingPaymentFailedEvent;
import com.elearning.paymentservice.dto.event.BookingPaymentSuccessEvent;
import com.elearning.paymentservice.dto.request.SepayWebhookRequest;
import com.elearning.paymentservice.dto.sepay.SepayIpnRequest;
import com.elearning.paymentservice.entity.PaymentTransaction;
import com.elearning.paymentservice.enums.PaymentStatus;
import com.elearning.paymentservice.exception.PaymentGatewayException;
import com.elearning.paymentservice.kafka.KafkaProducer;
import com.elearning.paymentservice.repository.PaymentTransactionRepository;
import com.elearning.paymentservice.service.SepayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class SepayServiceImpl implements SepayService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final KafkaProducer kafkaProducer;

    @Override
    @Transactional
    public void processIpn(String secretKey, SepayIpnRequest request) {
        log.info("Processing SePay IPN notification: type={}, orderId={}", 
                request.getNotificationType(), 
                request.getOrder() != null ? request.getOrder().getOrderId() : null);

        // Validate request
        if (request.getOrder() == null || request.getTransaction() == null) {
            log.error("Invalid IPN request: missing order or transaction data");
            throw new PaymentGatewayException("Invalid IPN request");
        }

        String orderId = request.getOrder().getOrderId();
        String transactionId = request.getTransaction().getTransactionId();
        String orderStatus = request.getOrder().getOrderStatus();
        String notificationType = request.getNotificationType();

        log.info("IPN - OrderId: {}, TransactionId: {}, Type: {}, OrderStatus: {}", 
                orderId, transactionId, notificationType, orderStatus);

        // Find payment transaction by provider transaction ID
        Optional<PaymentTransaction> optionalTransaction = paymentTransactionRepository.findByProviderTransactionId(transactionId);
        
        if (optionalTransaction.isEmpty()) {
            log.warn("Payment transaction not found for provider transaction ID: {}", transactionId);
            return;
        }

        PaymentTransaction paymentTransaction = optionalTransaction.get();

        // Update transaction details
        paymentTransaction.setProviderTransactionId(transactionId);
        paymentTransaction.setResultCode(orderStatus);
        paymentTransaction.setResponseTime(LocalDateTime.now());

        // Handle based on notification type
        if ("ORDER_PAID".equals(notificationType) && "PAID".equals(orderStatus)) {
            
            // Payment successful
            handlePaymentSuccess(paymentTransaction);
            
        } else if ("TRANSACTION_VOID".equals(notificationType)) {
            
            // Transaction cancelled/refunded
            handlePaymentFailed(paymentTransaction, "Transaction voided");
            
        } else {
            
            // Other statuses
            log.warn("Unhandled IPN status - Type: {}, OrderStatus: {}", 
                    notificationType, orderStatus);
        }
    }

    @Override
    @Transactional
    public void processSepayWebhook(SepayWebhookRequest request) {
        log.info("Processing SePay webhook: id={}, gateway={}, amount={}, content={}", 
                request.getId(), request.getGateway(), request.getTransferAmount(), request.getContent());

        // Only process incoming transfers
        if (!"in".equals(request.getTransferType())) {
            log.info("Ignoring non-incoming transfer: type={}", request.getTransferType());
            return;
        }

        // Extract order ID from content (assuming format contains UUID)
        UUID orderId = extractOrderIdFromContent(request.getContent());
        
        if (orderId == null) {
            log.warn("Could not extract order ID from content: {}", request.getContent());
            return;
        }

        log.info("Extracted orderId: {} from content", orderId);

        // Find payment transaction by orderId
        Optional<PaymentTransaction> optionalTransaction = paymentTransactionRepository.findByOrderId(orderId);
        
        if (optionalTransaction.isEmpty()) {
            log.warn("Payment transaction not found for orderId: {}", orderId);
            return;
        }

        PaymentTransaction transaction = optionalTransaction.get();

        // Verify amount matches
        BigDecimal expectedAmount = transaction.getAmount();
        BigDecimal receivedAmount = BigDecimal.valueOf(request.getTransferAmount());

        if (expectedAmount.compareTo(receivedAmount) != 0) {
            log.warn("Amount mismatch: expected={}, received={}", expectedAmount, receivedAmount);
            // Still process but log warning
        }

        // Update transaction with Sepay details
        transaction.setProviderTransactionId(String.valueOf(request.getId()));
        transaction.setPartnerCode(request.getGateway());
        transaction.setOrderInfo(request.getContent());
        transaction.setResultCode("0"); // Success
        transaction.setResultMessage("Payment received via SePay webhook");
        
        // Parse transaction date
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            transaction.setResponseTime(LocalDateTime.parse(request.getTransactionDate(), formatter));
        } catch (Exception e) {
            transaction.setResponseTime(LocalDateTime.now());
        }

        // Mark as successful
        handlePaymentSuccess(transaction);
        
        log.info("Successfully processed SePay webhook for orderId: {}", orderId);
    }

    /**
     * Extract UUID order ID from transfer content
     * Supports formats like: "DH abc123..." or just the UUID
     */
    private UUID extractOrderIdFromContent(String content) {
        if (content == null || content.isEmpty()) {
            return null;
        }

        // 1. Try standard UUID format (with hyphens)
        Pattern standardUuidPattern = Pattern.compile(
            "([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})"
        );
        Matcher standardMatcher = standardUuidPattern.matcher(content);
        if (standardMatcher.find()) {
            try {
                return UUID.fromString(standardMatcher.group(1));
            } catch (Exception e) {
                log.error("Failed to parse standard UUID from content: {}", content);
            }
        }

        // 2. Try UUID format without hyphens (32 hex chars)
        Pattern compactUuidPattern = Pattern.compile("\\b([0-9a-fA-F]{32})\\b");
        Matcher compactMatcher = compactUuidPattern.matcher(content);
        if (compactMatcher.find()) {
            try {
                String hex = compactMatcher.group(1);
                // Insert hyphens: 8-4-4-4-12
                String formattedUuid = String.format("%s-%s-%s-%s-%s",
                        hex.substring(0, 8),
                        hex.substring(8, 12),
                        hex.substring(12, 16),
                        hex.substring(16, 20),
                        hex.substring(20, 32));
                return UUID.fromString(formattedUuid);
            } catch (Exception e) {
                log.error("Failed to parse compact UUID from content: {}", content);
            }
        }

        return null;
    }

    private void handlePaymentSuccess(PaymentTransaction transaction) {
        log.info("Handling payment success for transaction ID: {}", transaction.getId());

        transaction.setStatus(PaymentStatus.COMPLETED);
        transaction.setPaidAt(LocalDateTime.now());
        paymentTransactionRepository.save(transaction);

        // Send Kafka event
        BookingPaymentSuccessEvent event = BookingPaymentSuccessEvent.builder()
                .bookingId(transaction.getOrderId())
                .classId(null)
                .transactionId(transaction.getId())
                .providerTransactionId(transaction.getProviderTransactionId())
                .build();

        kafkaProducer.sendBookingPaymentSuccessEvent(event);
        log.info("Sent payment success event for bookingId: {}", transaction.getOrderId());
    }

    private void handlePaymentFailed(PaymentTransaction transaction, String reason) {
        log.info("Handling payment failed for transaction ID: {}, reason: {}", transaction.getId(), reason);

        transaction.setStatus(PaymentStatus.FAILED);
        transaction.setResultMessage(reason);
        paymentTransactionRepository.save(transaction);

        // Send Kafka event
        BookingPaymentFailedEvent event = BookingPaymentFailedEvent.builder()
                .bookingId(transaction.getOrderId())
                .classId(null)
                .reason(reason)
                .build();

        kafkaProducer.sendBookingPaymentFailedEvent(event);
        log.info("Sent payment failed event for bookingId: {}", transaction.getOrderId());
    }
}

