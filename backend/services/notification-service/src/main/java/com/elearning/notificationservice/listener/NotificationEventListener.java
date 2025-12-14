package com.elearning.notificationservice.listener;

import com.elearning.notificationservice.dto.event.NotificationEvent;
import com.elearning.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final NotificationService notificationService;

    @KafkaListener(topics = "create-notification")
    public void handleNotificationEvent(NotificationEvent event) {
        log.info("Received notification event: {}", event);
        notificationService.createNotification(event);
    }
}