package com.elearning.paymentservice.strategy.impl;

import com.elearning.paymentservice.dto.request.InitiatePaymentRequest;
import com.elearning.paymentservice.strategy.PaymentGatewayStrategy;
import com.elearning.paymentservice.strategy.dto.GatewayCreationResponse;
import com.elearning.paymentservice.strategy.dto.RefundRequest;
import com.elearning.paymentservice.strategy.dto.RefundResponse;
import com.elearning.paymentservice.strategy.dto.StandardizedPaymentResult;
import com.elearning.paymentservice.strategy.dto.WebhookPayload;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class SepayGatewayStrategy implements PaymentGatewayStrategy {

    @Override
    public GatewayCreationResponse createPaymentIntent(InitiatePaymentRequest request) {
        // SePay is QR transfer, so we don't need to call an external API to create an order.
        // We just return success and let the client display the QR.
        // The transaction is already created by PaymentServiceImpl before calling this strategy.
        
        return GatewayCreationResponse.builder()
                .paymentUrl(null) // No redirect URL
                .providerTransactionId(null) // No external ID yet
                .qrCodeContent("DH " + request.getOrderId()) // Example content
                .build();
    }

    @Override
    public StandardizedPaymentResult handleWebhook(WebhookPayload payload) {
        // SePay webhook handling is done in SepayServiceImpl (via SepayController),
        // so this method is generally unused unless we unify the flow.
        return StandardizedPaymentResult.builder()
                .status("SUCCESS")
                .build();
    }

    @Override
    public RefundResponse createRefund(RefundRequest request) {
        // SePay (Bank Transfer) usually doesn't support API refund
        return RefundResponse.builder()
                .refundId("REF-" + UUID.randomUUID())
                .status("MANUAL_PROCESSING_REQUIRED") // Indicate manual refund needed
                .build();
    }
}
