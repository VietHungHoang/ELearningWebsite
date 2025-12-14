package com.elearning.bffservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.elearning.bffservice.client.NotificationServiceClient;
import com.elearning.bffservice.dto.request.NotificationRequest;
import com.elearning.bffservice.dto.response.NotificationResponse;
import com.elearning.bffservice.service.NotificationService;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationServiceClient notificationServiceClient;

    @Override
    public NotificationResponse createNotification(NotificationRequest request) {
        return notificationServiceClient.createNotification(request);
    }
}
