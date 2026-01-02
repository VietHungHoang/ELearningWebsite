package com.elearning.classservice.kafka;

import com.elearning.classservice.dto.event.AccountCreatedEvent;
import com.elearning.classservice.entity.User;
import com.elearning.classservice.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class StudentAccountConsumer {

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    private static final String STUDENT_ACCOUNT_CREATED_TOPIC = "student_account_created";

    @KafkaListener(topics = STUDENT_ACCOUNT_CREATED_TOPIC, groupId = "class-service-group")
    public void handleStudentAccountCreated(String message) {
        try {
            log.info("Received student account created event: {}", message);
            
            AccountCreatedEvent event = objectMapper.readValue(message, AccountCreatedEvent.class);
            UUID userId = UUID.fromString(event.getId());
            
            // Check if user already exists
            if (userRepository.existsById(userId)) {
                log.info("User already exists, skipping creation: {}", userId);
                return;
            }
            
            // Create user record in class-service database
            User user = User.builder()
                    .id(userId)
                    .fullName(event.getFullName())
                    .avatarUrl(null) // Will be updated later
                    .build();
            
            userRepository.save(user);
            log.info("Created user record for student: {}", event.getId());
            
        } catch (Exception e) {
            log.error("Failed to process student account created event: {}", message, e);
        }
    }
}
