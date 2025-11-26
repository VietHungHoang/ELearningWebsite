package com.elearning.userservice.kafka;

import com.elearning.userservice.dto.AccountCreatedEvent;
import com.elearning.userservice.entity.User;
import com.elearning.userservice.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class AccountCreatedListener {
    
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @KafkaListener(topics = "user_account_created", groupId = "user-service-group")
    public void handleAccountCreated(String message) {
        try {
            log.info("Received account created event: {}", message);
            
            AccountCreatedEvent event = objectMapper.readValue(message, AccountCreatedEvent.class);
            
            UUID id = UUID.fromString(event.getId());
            
            // Check if user already exists
            if (userRepository.existsById(id)) {
                log.warn("User with id {} already exists, skipping", id);
                return;
            }
            
            // Create new user
            User user = User.builder()
                    .id(id)
                    .email(event.getEmail())
                    .fullname(event.getFullname())
                    .role(event.getRole())
                    .build();
            
            userRepository.save(user);
            log.info("Successfully created user with id: {}", user.getId());
            
        } catch (Exception e) {
            log.error("Error processing account created event: {}", e.getMessage(), e);
        }
    }
}
