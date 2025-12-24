package com.elearning.paymentservice.service.impl;

import com.elearning.paymentservice.dto.event.BookingPaymentFailedEvent;
import com.elearning.paymentservice.dto.event.BookingPaymentSuccessEvent;
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

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

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

    private void handlePaymentSuccess(PaymentTransaction transaction) {
        log.info("Handling payment success for transaction ID: {}", transaction.getId());

        transaction.setStatus(PaymentStatus.COMPLETED);
        transaction.setPaidAt(LocalDateTime.now());
        paymentTransactionRepository.save(transaction);

        // Send Kafka event
        BookingPaymentSuccessEvent event = BookingPaymentSuccessEvent.builder()
                .bookingId(transaction.getOrderId())
                .classId(null)
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
