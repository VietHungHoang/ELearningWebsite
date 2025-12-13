package com.elearning.paymentservice.controller;

import com.elearning.paymentservice.dto.request.InitiatePaymentRequest;
import com.elearning.paymentservice.dto.response.ApiResponse;
import com.elearning.paymentservice.dto.response.InitiatePaymentResponse;
import com.elearning.paymentservice.service.PaymentService;
import com.elearning.paymentservice.strategy.dto.WebhookPayload;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse<InitiatePaymentResponse>> initiatePayment(
            @Valid @RequestBody InitiatePaymentRequest request) {

        log.info("Received initiate payment request for orderId: {}", request.getOrderId());

        InitiatePaymentResponse response = paymentService.initiatePayment(request);

        return ResponseEntity.ok(ApiResponse.success(response, "Payment initiated successfully"));
    }

    @PostMapping("/webhook/{provider}")
    public ResponseEntity<ApiResponse<Void>> handleWebhook(
            @PathVariable String provider,
            @RequestBody WebhookPayload payload) {

        log.info("Received webhook from provider: {}", provider);

        try {
            paymentService.processWebhook(payload);
            return ResponseEntity.ok(ApiResponse.success(null, "Webhook processed successfully"));
        } catch (Exception e) {
            log.error("Error processing webhook from provider {}: {}", provider, e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.error("Failed to process webhook: " + e.getMessage(), 500));
        }
    }
}