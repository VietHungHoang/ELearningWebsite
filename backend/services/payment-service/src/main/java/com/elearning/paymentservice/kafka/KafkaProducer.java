package com.elearning.paymentservice.kafka;

import com.elearning.paymentservice.dto.event.BookingPaymentFailedEvent;
import com.elearning.paymentservice.dto.event.BookingPaymentSuccessEvent;
import com.elearning.paymentservice.dto.event.PaymentCompletedEvent;
import com.elearning.paymentservice.dto.event.PaymentFailedEvent;
import com.elearning.paymentservice.dto.event.PaymentRefundedEvent;
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

    public void sendMessage(String topic, Object message) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(message);
            kafkaTemplate.send(topic, jsonMessage);
            log.info("Sent message to topic {}: {}", topic, jsonMessage);
        } catch (JsonProcessingException e) {
            log.error("Error converting message to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize message", e);
        }
    }

    public void sendPaymentCompletedEvent(PaymentCompletedEvent event) {
        sendMessage(KafkaTopics.PAYMENT_COMPLETED, event.getOrderId().toString(), event);
    }

    public void sendPaymentFailedEvent(PaymentFailedEvent event) {
        sendMessage(KafkaTopics.PAYMENT_FAILED, event.getOrderId().toString(), event);
    }

    public void sendPaymentRefundedEvent(PaymentRefundedEvent event) {
        sendMessage(KafkaTopics.PAYMENT_REFUNDED, event.getOrderId().toString(), event);
    }

    public void sendBookingPaymentSuccessEvent(BookingPaymentSuccessEvent event) {
        sendMessage(KafkaTopics.PAYMENT_BOOKING_SUCCESS, event.getBookingId().toString(), event);
    }

    public void sendBookingPaymentFailedEvent(BookingPaymentFailedEvent event) {
        sendMessage(KafkaTopics.PAYMENT_BOOKING_FAILED, event.getBookingId().toString(), event);
    }
}