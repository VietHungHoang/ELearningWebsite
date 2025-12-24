package com.elearning.bookingservice.client;

import com.elearning.bookingservice.dto.request.CreateClassBookingRequest;
import com.elearning.bookingservice.dto.response.ApiResponse;
import com.elearning.bookingservice.dto.response.CreateClassBookingResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
public class ClassServiceClientImpl implements ClassServiceClient {

    private final RestTemplate restTemplate;

    @Value("${services.class-service.url:http://localhost:8082}")
    private String classServiceUrl;

    @Override
    public CreateClassBookingResponse createClassBooking(CreateClassBookingRequest request) {
        String url = classServiceUrl + "/api/v1/classes/sessions/bookings";
        log.info("Calling class-service to create booking: {}", url);

        ResponseEntity<ApiResponse<CreateClassBookingResponse>> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            new HttpEntity<>(request),
            new ParameterizedTypeReference<ApiResponse<CreateClassBookingResponse>>() {}
        );

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null && response.getBody().isSuccess()) {
            return response.getBody().getData();
        } else {
            log.error("Failed to create class booking, status: {}", response.getStatusCode());
            throw new RuntimeException("Failed to create class booking");
        }
    }
}