package com.elearning.paymentservice.strategy;

import com.elearning.paymentservice.dto.request.InitiatePaymentRequest;
import com.elearning.paymentservice.strategy.dto.*;

/**
 * Common contract for payment gateway implementations (Strategy).
 */
public interface PaymentGatewayStrategy {

    // 1. Create a payment intent and return information the front-end needs
    GatewayCreationResponse createPaymentIntent(InitiatePaymentRequest request);

    // 2. Handle incoming webhook payload from provider and return a standardized result
    StandardizedPaymentResult handleWebhook(WebhookPayload payload);

    // 3. Create a refund request
    RefundResponse createRefund(RefundRequest request);
}
