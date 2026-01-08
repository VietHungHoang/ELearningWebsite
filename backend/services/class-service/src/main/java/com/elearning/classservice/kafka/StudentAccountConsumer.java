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

            // Use findById + update pattern to avoid race condition
            User user = userRepository.findById(userId)
                    .map(existingUser -> {
                        // Update existing user if needed
                        log.info("User already exists, updating if needed: {}", userId);
                        if (event.getEmail() != null && existingUser.getEmail() == null) {
                            existingUser.setEmail(event.getEmail());
                            log.info("Updated email for existing user: {}", userId);
                        }
                        if (event.getFullName() != null) {
                            existingUser.setFullName(event.getFullName());
                        }
                        return existingUser;
                    })
                    .orElseGet(() -> {
                        // Create new user
                        log.info("Creating new user record for student: {}", userId);
                        return User.builder()
                                .id(userId)
                                .fullName(event.getFullName())
                                .email(event.getEmail())
                                .avatarUrl(null)
                                .build();
                    });

            userRepository.save(user);
            log.info("Saved user record for student: {} with email: {}", event.getId(), event.getEmail());

        } catch (Exception e) {
            log.error("Failed to process student account created event: {}", message, e);
        }
    }
}
