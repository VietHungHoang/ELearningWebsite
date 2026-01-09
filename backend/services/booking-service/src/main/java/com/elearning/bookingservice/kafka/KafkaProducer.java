package com.elearning.bookingservice.kafka;

import com.elearning.bookingservice.dto.event.BookingPaymentFailedEvent;
import com.elearning.bookingservice.dto.event.BookingPaymentSuccessEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void sendMessage(String topic, String key, Object message) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(message);
            kafkaTemplate.send(topic, key, jsonMessage);
            log.info("Sent message to topic {} with key {}: {}", topic, key, jsonMessage);
        } catch (JsonProcessingException e) {
            log.error("Error converting message to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize message", e);
        }
    }

    public void sendBookingPaymentSuccessToClassService(BookingPaymentSuccessEvent event) {
        sendMessage("booking_class_success", event.getBookingId().toString(), event);
    }

    public void sendBookingPaymentFailedToClassService(BookingPaymentFailedEvent event) {
        sendMessage("booking_class_failed", event.getBookingId().toString(), event);
    }

    public void sendPaymentSuccessNotification(Object event) {
        sendMessage("payment_success_notification", null, event);
    }
}
