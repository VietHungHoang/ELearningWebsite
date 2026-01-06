package com.elearning.tutorservice.kafka.consumer;

import com.elearning.tutorservice.dto.event.TutorHourlyRateRequestEvent;
import com.elearning.tutorservice.dto.event.TutorHourlyRateResponseEvent;
import com.elearning.tutorservice.entity.Tutor;
import com.elearning.tutorservice.repository.TutorRepository;
import com.elearning.tutorservice.service.producer.KafkaProducer;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Kafka consumer to receive hourly rate requests from class-service
 * and respond with tutor's currentSessionFee
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TutorHourlyRateRequestConsumer {

    private static final String TUTOR_HOURLY_RATE_REQUEST_TOPIC = "request_tutor_hourly_rate";

    private final TutorRepository tutorRepository;
    private final KafkaProducer kafkaProducer;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = TUTOR_HOURLY_RATE_REQUEST_TOPIC, groupId = "tutor-service-group")
    public void handleTutorHourlyRateRequest(String message) {
        try {
            log.info("Received tutor hourly rate request: {}", message);

            TutorHourlyRateRequestEvent event = objectMapper.readValue(message, TutorHourlyRateRequestEvent.class);

            if (event.getTutorId() == null || event.getClassId() == null) {
                log.warn("Invalid tutor hourly rate request: missing tutorId or classId");
                return;
            }

            // Find tutor by ID
            Tutor tutor = tutorRepository.findById(event.getTutorId())
                    .orElse(null);

            if (tutor == null) {
                log.warn("Tutor not found for ID: {}", event.getTutorId());
                return;
            }

            // Get hourly rate (currentSessionFee)
            BigDecimal hourlyRate = tutor.getCurrentSessionFee();

            if (hourlyRate == null) {
                log.warn("Tutor {} has no currentSessionFee set", event.getTutorId());
                hourlyRate = BigDecimal.ZERO;
            }

            // Send response back to class-service
            TutorHourlyRateResponseEvent response = TutorHourlyRateResponseEvent.builder()
                    .classId(event.getClassId())
                    .tutorId(event.getTutorId())
                    .hourlyRate(hourlyRate)
                    .build();

            kafkaProducer.sendTutorHourlyRateResponse(response);
            log.info("Sent tutor hourly rate response for tutor {} with rate {}", event.getTutorId(), hourlyRate);

        } catch (Exception e) {
            log.error("Error processing tutor hourly rate request: {}", e.getMessage(), e);
        }
    }
}
