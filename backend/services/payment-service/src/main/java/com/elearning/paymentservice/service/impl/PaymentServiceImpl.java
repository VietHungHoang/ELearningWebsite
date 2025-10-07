package com.elearning.paymentservice.service.impl;

import com.elearning.paymentservice.dto.request.InitiatePaymentRequest;
import com.elearning.paymentservice.dto.response.InitiatePaymentResponse;
import com.elearning.paymentservice.dto.response.PaymentData;
import com.elearning.paymentservice.enums.PaymentMethodType;
import com.elearning.paymentservice.mapper.PaymentMapper;
import com.elearning.paymentservice.model.PaymentTransaction;
import com.elearning.paymentservice.repository.PaymentTransactionRepository;
import com.elearning.paymentservice.service.PaymentService;
import com.elearning.paymentservice.strategy.PaymentGatewayFactory;
import com.elearning.paymentservice.strategy.dto.GatewayCreationResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final PaymentGatewayFactory paymentGatewayFactory;

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
}