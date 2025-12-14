package com.elearning.studentservice.kafka;

import com.elearning.studentservice.dto.event.AccountCreatedEvent;
import com.elearning.studentservice.service.StudentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumer {

    private final ObjectMapper objectMapper;
    private final StudentService studentService;

    private static final String ACCOUNT_CREATED_TOPIC = "student_account_created";

    @KafkaListener(topics = ACCOUNT_CREATED_TOPIC, groupId = "student-service-group")
    public void handleAccountCreated(String message) {
        try {
            AccountCreatedEvent event = objectMapper.readValue(message, AccountCreatedEvent.class);
            log.info("Received account created event for user: {}", event.getId());
            studentService.createStudent(event);

        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize account created event", e);
        } catch (Exception e) {
            log.error("Failed to process account created event", e);
        }
    }
}