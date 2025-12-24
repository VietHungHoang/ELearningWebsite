package com.elearning.studentservice.client;

import com.elearning.studentservice.dto.request.CreatePaymentRequest;
import com.elearning.studentservice.dto.response.CreatePaymentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceClientImpl implements PaymentServiceClient {

    private final RestTemplate restTemplate;

    @Value("${services.payment-service.url:http://localhost:8083}")
    private String paymentServiceUrl;

    @Override
    public CreatePaymentResponse createPayment(CreatePaymentRequest request) {
        String url = paymentServiceUrl + "/api/v1/payments";
        log.info("Calling payment-service to create payment: {}", url);

        ResponseEntity<CreatePaymentResponse> response = restTemplate.postForEntity(url, request, CreatePaymentResponse.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        } else {
            log.error("Failed to create payment, status: {}", response.getStatusCode());
            throw new RuntimeException("Failed to create payment");
        }
    }
}