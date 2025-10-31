package com.elearning.authservice.client;

import com.elearning.authservice.client.dto.request.NotificationRequest;
import com.elearning.authservice.config.ExternalApiConfig;
import com.elearning.authservice.exception.NotificationException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class NotificationClient {

    private final RestTemplate restTemplate;
    private final ExternalApiConfig externalApiConfig;

    public void sendOtpEmail(String email, String otp) {
        try {
            String url = externalApiConfig.getNotificationServiceUrl() + "/api/notification/send-otp";
            NotificationRequest request = new NotificationRequest(email, otp);
            ResponseEntity<Void> response = restTemplate.postForEntity(url, request, Void.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new NotificationException("Failed to send OTP email: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new NotificationException("Error sending OTP email", e);
        }
    }
}