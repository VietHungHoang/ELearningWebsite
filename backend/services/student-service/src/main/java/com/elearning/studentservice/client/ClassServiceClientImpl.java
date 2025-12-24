package com.elearning.studentservice.client;

import com.elearning.studentservice.dto.request.CreateClassBookingRequest;
import com.elearning.studentservice.dto.response.CreateClassBookingResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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

        ResponseEntity<CreateClassBookingResponse> response = restTemplate.postForEntity(url, request, CreateClassBookingResponse.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        } else {
            log.error("Failed to create class booking, status: {}", response.getStatusCode());
            throw new RuntimeException("Failed to create class booking");
        }
    }
}