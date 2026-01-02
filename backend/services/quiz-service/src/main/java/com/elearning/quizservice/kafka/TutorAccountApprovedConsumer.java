package com.elearning.quizservice.kafka;

import com.elearning.quizservice.dto.event.TutorAccountApprovedEvent;
import com.elearning.quizservice.entity.User;
import com.elearning.quizservice.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Kafka consumer for tutor account approved events
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TutorAccountApprovedConsumer {

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "tutor_approved", groupId = "quiz-service-group")
    public void consumeTutorAccountApproved(String message) {
        try {
            log.info("Received tutor approved event: {}", message);
            
            TutorAccountApprovedEvent event = objectMapper.readValue(message, TutorAccountApprovedEvent.class);
            
            // Check if user already exists
            User existingUser = userRepository.findById(event.getTutorId()).orElse(null);
            
            if (existingUser != null) {
                // Update existing user
                existingUser.setFullName(event.getFullName());
                existingUser.setAvatarUrl(event.getAvatarUrl());
                userRepository.save(existingUser);
                log.info("Updated tutor user: {}", event.getTutorId());
            } else {
                // Create new user
                User newUser = User.builder()
                        .id(event.getTutorId())
                        .fullName(event.getFullName())
                        .avatarUrl(event.getAvatarUrl())
                        .build();
                userRepository.save(newUser);
                log.info("Created new tutor user: {}", event.getTutorId());
            }
            
        } catch (Exception e) {
            log.error("Error processing tutor approved event: {}", message, e);
            // Consider implementing retry logic or dead letter queue
        }
    }
}
