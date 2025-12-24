package com.elearning.bookingservice.kafka;

import com.elearning.bookingservice.dto.event.BookingPaymentFailedEvent;
import com.elearning.bookingservice.dto.event.BookingPaymentSuccessEvent;
import com.elearning.bookingservice.service.BookingPaymentEventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingPaymentEventConsumer {

    private final BookingPaymentEventService bookingPaymentEventService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "payment_booking_success", groupId = "booking-service-group")
    public void handleBookingPaymentSuccess(String message) {
        try {
            log.info("Received booking payment success event: {}", message);
            BookingPaymentSuccessEvent event = objectMapper.readValue(message, BookingPaymentSuccessEvent.class);
            bookingPaymentEventService.handlePaymentSuccess(event);
        } catch (Exception e) {
            log.error("Error processing booking payment success event: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(topics = "payment_booking_failed", groupId = "booking-service-group")
    public void handleBookingPaymentFailed(String message) {
        try {
            log.info("Received booking payment failed event: {}", message);
            BookingPaymentFailedEvent event = objectMapper.readValue(message, BookingPaymentFailedEvent.class);
            bookingPaymentEventService.handlePaymentFailed(event);
        } catch (Exception e) {
            log.error("Error processing booking payment failed event: {}", e.getMessage(), e);
        }
    }
}
