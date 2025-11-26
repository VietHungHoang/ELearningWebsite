package com.elearning.paymentservice.controller;

import com.elearning.paymentservice.dto.request.InitiatePaymentRequest;
import com.elearning.paymentservice.dto.response.ApiResponse;
import com.elearning.paymentservice.dto.response.InitiatePaymentResponse;
import com.elearning.paymentservice.enums.PaymentGateway;
import com.elearning.paymentservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
@Slf4j
public class TestController {

    private final PaymentService paymentService;

    @GetMapping("/initiate-payment")
    public ResponseEntity<ApiResponse<InitiatePaymentResponse>> testInitiatePayment() {

        log.info("Testing initiate payment with sample data");

        // Tạo request mẫu
        InitiatePaymentRequest request = InitiatePaymentRequest.builder()
                .orderId(UUID.randomUUID())
                .amount(BigDecimal.valueOf(100000)) // 100,000 VND
                .currency("VND")
                .paymentProvider(PaymentGateway.MOMO)
                .redirectUrl("http://localhost:8086/payment/callback")
                .build();

        try {
            InitiatePaymentResponse response = paymentService.initiatePayment(request);

            return ResponseEntity.ok(
                    ApiResponse.<InitiatePaymentResponse>builder()
                            .status(200)
                            .message("Test payment initiated successfully")
                            .data(response)
                            .build()
            );
        } catch (Exception e) {
            log.error("Error during test initiate payment", e);
            return ResponseEntity.status(500).body(
                    ApiResponse.<InitiatePaymentResponse>builder()
                            .status(500)
                            .message("Test failed: " + e.getMessage())
                            .build()
            );
        }
    }
}