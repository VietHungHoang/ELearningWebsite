package com.elearning.paymentservice.service;

import com.elearning.paymentservice.dto.request.ConfirmPaymentRequest;
import com.elearning.paymentservice.dto.request.InitiatePaymentRequest;
import com.elearning.paymentservice.dto.response.InitiatePaymentResponse;
import com.elearning.paymentservice.dto.response.PaymentHistoryItem;
import com.elearning.paymentservice.strategy.dto.WebhookPayload;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PaymentService {

    InitiatePaymentResponse initiatePayment(InitiatePaymentRequest request);

    void processWebhook(WebhookPayload payload);

    void confirmPayment(ConfirmPaymentRequest request);

    Page<PaymentHistoryItem> getPaymentHistory(UUID userId, Pageable pageable);

    void handlePaymentSuccess(UUID bookingId);

    void handlePaymentError(UUID bookingId);

    com.elearning.paymentservice.enums.PaymentStatus checkPaymentStatus(UUID orderId);
}