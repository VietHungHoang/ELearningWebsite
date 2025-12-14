package com.elearning.paymentservice.service;

import com.elearning.paymentservice.dto.request.InitiatePaymentRequest;
import com.elearning.paymentservice.dto.response.InitiatePaymentResponse;
import com.elearning.paymentservice.strategy.dto.WebhookPayload;

public interface PaymentService {

    InitiatePaymentResponse initiatePayment(InitiatePaymentRequest request);

    void processWebhook(WebhookPayload payload);
}