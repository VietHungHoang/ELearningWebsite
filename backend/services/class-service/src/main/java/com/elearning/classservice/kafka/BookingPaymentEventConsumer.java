package com.elearning.classservice.kafka;

import com.elearning.classservice.dto.event.BookingPaymentFailedEvent;
import com.elearning.classservice.dto.event.BookingPaymentSuccessEvent;
import com.elearning.classservice.service.ClassPaymentEventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingPaymentEventConsumer {

    private final ClassPaymentEventService classPaymentEventService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "booking_class_success", groupId = "class-service-group")
    public void handleBookingPaymentSuccess(String message) {
        try {
            log.info("Received booking payment success event: {}", message);
            BookingPaymentSuccessEvent event = objectMapper.readValue(message, BookingPaymentSuccessEvent.class);
            classPaymentEventService.handlePaymentSuccess(event);
        } catch (Exception e) {
            log.error("Error processing booking payment success event: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(topics = "booking_class_failed", groupId = "class-service-group")
    public void handleBookingPaymentFailed(String message) {
        try {
            log.info("Received booking payment failed event: {}", message);
            BookingPaymentFailedEvent event = objectMapper.readValue(message, BookingPaymentFailedEvent.class);
            classPaymentEventService.handlePaymentFailed(event);
        } catch (Exception e) {
            log.error("Error processing booking payment failed event: {}", e.getMessage(), e);
        }
    }
}
