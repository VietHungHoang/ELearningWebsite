package com.elearning.authservice.kafka.consumer;

import com.elearning.authservice.dto.event.AvatarUpdateEvent;
import com.elearning.authservice.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AvatarUpdateConsumer {

    private final ObjectMapper objectMapper;
    private final UserService userService;

    private static final String AVATAR_UPDATE_TOPIC = "user_avatar_update";

    @KafkaListener(topics = AVATAR_UPDATE_TOPIC, groupId = "auth-service-group")
    public void handleAvatarUpdate(String message) {
        log.info("Received avatar update event: {}", message);
        try {
            AvatarUpdateEvent event = objectMapper.readValue(message, AvatarUpdateEvent.class);
            log.info("Processing avatar update: userId={}, avatarUrl={}", event.getUserId(), event.getAvatarUrl());

            // Update avatar in Keycloak
            userService.updateUserAvatar(event.getUserId().toString(), event.getAvatarUrl());

            log.info("Successfully updated avatar for user {}", event.getUserId());
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize avatar update event: {}", message, e);
        } catch (Exception e) {
            log.error("Failed to process avatar update: {}", message, e);
        }
    }
}
