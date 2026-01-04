package com.elearning.paymentservice.controller;

import com.elearning.paymentservice.dto.request.SepayWebhookRequest;
import com.elearning.paymentservice.dto.response.ApiResponse;
import com.elearning.paymentservice.dto.sepay.SepayIpnRequest;
import com.elearning.paymentservice.service.SepayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
public class SepayController {

    private final SepayService sepayService;

    /**
     * IPN endpoint to receive webhook notifications from SePay
     * POST /api/v1/payments/sepay/ipn
     */
    @PostMapping("/api/v1/payments/sepay/ipn")
    public ResponseEntity<ApiResponse<Void>> handleIpn(
            @RequestHeader(value = "X-Secret-Key", required = false) String secretKey,
            @RequestBody SepayIpnRequest request) {

        log.info("Received SePay IPN notification: type={}, orderId={}", 
                request.getNotificationType(), 
                request.getOrder() != null ? request.getOrder().getOrderId() : null);

        try {
            sepayService.processIpn(secretKey, request);
            return ResponseEntity.ok(ApiResponse.success(null, "IPN processed successfully"));
        } catch (Exception e) {
            log.error("Error processing SePay IPN: {}", e.getMessage(), e);
            return ResponseEntity.ok(ApiResponse.success(null, "IPN received"));
        }
    }

    /**
     * Webhook endpoint to receive payment notifications from SePay
     * POST /hooks/sepay-payment
     */
    @PostMapping("/hooks/sepay-payment")
    public ResponseEntity<Void> handleSepayWebhook(@RequestBody SepayWebhookRequest request) {

        log.info("Received SePay webhook: id={}, gateway={}, amount={}, content={}", 
                request.getId(), request.getGateway(), request.getTransferAmount(), request.getContent());

        try {
            sepayService.processSepayWebhook(request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error processing SePay webhook: {}", e.getMessage(), e);
            // Return 200 OK anyway to acknowledge receipt
            return ResponseEntity.ok().build();
        }
    }
}
