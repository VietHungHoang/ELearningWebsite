package com.elearning.classservice.kafka;

import com.elearning.classservice.dto.event.TutorHourlyRateResponseEvent;
import com.elearning.classservice.entity.ClassEntity;
import com.elearning.classservice.repository.ClassRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Kafka consumer to receive tutor hourly rate response from tutor-service
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TutorHourlyRateResponseConsumer {

    private static final String TUTOR_HOURLY_RATE_RESPONSE_TOPIC = "tutor_hourly_rate_response";

    private final ClassRepository classRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = TUTOR_HOURLY_RATE_RESPONSE_TOPIC, groupId = "class-service-group")
    @Transactional
    public void handleTutorHourlyRateResponse(String message) {
        try {
            log.info("Received tutor hourly rate response: {}", message);

            TutorHourlyRateResponseEvent event = objectMapper.readValue(message, TutorHourlyRateResponseEvent.class);

            if (event.getClassId() == null || event.getHourlyRate() == null) {
                log.warn("Invalid tutor hourly rate response: missing classId or hourlyRate");
                return;
            }

            // Find and update the class
            ClassEntity classEntity = classRepository.findById(event.getClassId())
                    .orElse(null);

            if (classEntity == null) {
                log.warn("Class not found for ID: {}", event.getClassId());
                return;
            }

            // Update pricePerHour
            classEntity.setPricePerHour(event.getHourlyRate().doubleValue());
            classRepository.save(classEntity);

            log.info("Updated class {} pricePerHour to {}", event.getClassId(), event.getHourlyRate());

        } catch (Exception e) {
            log.error("Error processing tutor hourly rate response: {}", e.getMessage(), e);
        }
    }
}
