package com.elearning.bookingservice.client;

import com.elearning.bookingservice.dto.request.CreatePaymentRequest;
import com.elearning.bookingservice.dto.response.ApiResponse;
import com.elearning.bookingservice.dto.response.CreatePaymentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceClientImpl implements PaymentServiceClient {

    private final RestTemplate restTemplate;

    @Value("${services.payment-service.url:http://payment-service:8091}")
    private String paymentServiceUrl;

    @Override
    public CreatePaymentResponse createPayment(CreatePaymentRequest request) {
        String url = paymentServiceUrl + "/api/v1/payments/initiate";
        log.info("Calling payment-service to create payment: {}", url);

        ResponseEntity<ApiResponse<CreatePaymentResponse>> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            new HttpEntity<>(request),
            new ParameterizedTypeReference<ApiResponse<CreatePaymentResponse>>() {}
        );

        log.info("Received response from payment-service: {}", Objects.toString(response.getBody()));

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null && response.getBody().isSuccess()) {
            return response.getBody().getData();
        } else {
            log.error("Failed to create payment, status: {}", response.getStatusCode());
            throw new RuntimeException("Failed to create payment");
        }
    }
}