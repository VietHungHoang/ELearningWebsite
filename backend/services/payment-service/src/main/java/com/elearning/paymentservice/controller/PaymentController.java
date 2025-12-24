package com.elearning.paymentservice.controller;

import com.elearning.paymentservice.dto.request.ConfirmPaymentRequest;
import com.elearning.paymentservice.dto.request.InitiatePaymentRequest;
import com.elearning.paymentservice.dto.request.PaymentCallbackRequest;
import com.elearning.paymentservice.dto.response.ApiResponse;
import com.elearning.paymentservice.dto.response.InitiatePaymentResponse;
import com.elearning.paymentservice.dto.response.PaymentHistoryItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.elearning.paymentservice.service.PaymentService;
import com.elearning.paymentservice.strategy.dto.WebhookPayload;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
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

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<Void>> confirmPayment(
            @Valid @RequestBody ConfirmPaymentRequest request) {

        log.info("Received confirm payment request for orderId: {}", request.getOrderId());

        try {
            paymentService.confirmPayment(request);
            return ResponseEntity.ok(ApiResponse.success(null, "Payment confirmed successfully"));
        } catch (Exception e) {
            log.error("Error confirming payment for orderId {}: {}", request.getOrderId(), e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.error("Failed to confirm payment: " + e.getMessage(), 500));
        }
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

    @GetMapping("/me/history")
    public ResponseEntity<ApiResponse<Page<PaymentHistoryItem>>> getPaymentHistory(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentHistoryItem> history = paymentService.getPaymentHistory(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(history, "Payment history retrieved successfully"));
    }

    @PostMapping("/success")
    public ResponseEntity<ApiResponse<Void>> handlePaymentSuccess(
            @Valid @RequestBody PaymentCallbackRequest request) {

        log.info("Received payment success callback for bookingId: {}", request.getBookingId());

        try {
            paymentService.handlePaymentSuccess(request.getBookingId());
            return ResponseEntity.ok(ApiResponse.success(null, "Payment success processed"));
        } catch (Exception e) {
            log.error("Error processing payment success for bookingId {}: {}", request.getBookingId(), e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.error("Failed to process payment success: " + e.getMessage(), 500));
        }
    }

    @PostMapping("/error")
    public ResponseEntity<ApiResponse<Void>> handlePaymentError(
            @Valid @RequestBody PaymentCallbackRequest request) {

        log.info("Received payment error callback for bookingId: {}", request.getBookingId());

        try {
            paymentService.handlePaymentError(request.getBookingId());
            return ResponseEntity.ok(ApiResponse.success(null, "Payment error processed"));
        } catch (Exception e) {
            log.error("Error processing payment error for bookingId {}: {}", request.getBookingId(), e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.error("Failed to process payment error: " + e.getMessage(), 500));
        }
    }
}