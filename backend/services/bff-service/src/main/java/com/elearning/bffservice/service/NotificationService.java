package com.elearning.bffservice.service;

import org.springframework.data.domain.Pageable;
import com.elearning.bffservice.dto.request.NotificationRequest;
import com.elearning.bffservice.dto.response.NotificationResponse;

public interface NotificationService {

    NotificationResponse createNotification(NotificationRequest request);
}
