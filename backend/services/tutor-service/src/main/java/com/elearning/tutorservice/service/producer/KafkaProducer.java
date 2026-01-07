package com.elearning.tutorservice.service.producer;

import com.elearning.tutorservice.dto.event.AvatarUpdateEvent;
import com.elearning.tutorservice.dto.event.RoleAssignRequestEvent;
import com.elearning.tutorservice.dto.event.TutorApprovedEvent;
import com.elearning.tutorservice.dto.event.TutorIndexEvent;
import com.elearning.tutorservice.dto.event.TutorHourlyRateResponseEvent;
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
    private final ObjectMapper objectMapper;

    private final String tutorApprovedTopic = "tutor_approved";
    private final String tutorIndexSyncTopic = "tutor-index-sync";
    private final String roleAssignRequestTopic = "tutor_role_assign_request";
    private final String avatarUpdateTopic = "user_avatar_update";

    public void sendTutorApprovedEvent(TutorApprovedEvent message) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(message);
            kafkaTemplate.send(tutorApprovedTopic, message.getTutorId().toString(), jsonMessage);
            log.info("Sent tutor approved event to topic {}: {}", tutorApprovedTopic, jsonMessage);
        } catch (JsonProcessingException e) {
            log.error("Error converting TutorApprovedEvent to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize TutorApprovedEvent", e);
        }
    }

    public void sendTutorIndexEvent(TutorIndexEvent event) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(tutorIndexSyncTopic, event.getTutorId().toString(), jsonMessage);
            log.info("Sent tutor index event to topic {}: type={}, tutorId={}, payload={}",
                    tutorIndexSyncTopic, event.getEventType(), event.getTutorId(), jsonMessage);
        } catch (JsonProcessingException e) {
            log.error("Error converting TutorIndexEvent to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize TutorIndexEvent", e);
        }
    }

    public void sendRoleAssignRequest(RoleAssignRequestEvent event) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(roleAssignRequestTopic, event.getUserId().toString(), jsonMessage);
            log.info("Sent role assign request to topic {}: userId={}, role={}",
                    roleAssignRequestTopic, event.getUserId(), event.getRole());
        } catch (JsonProcessingException e) {
            log.error("Error converting RoleAssignRequestEvent to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize RoleAssignRequestEvent", e);
        }
    }

    public void sendAvatarUpdateEvent(AvatarUpdateEvent event) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(avatarUpdateTopic, event.getUserId().toString(), jsonMessage);
            log.info("Sent avatar update event to topic {}: userId={}", avatarUpdateTopic, event.getUserId());
        } catch (JsonProcessingException e) {
            log.error("Error converting AvatarUpdateEvent to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize AvatarUpdateEvent", e);
        }
    }

    private static final String TUTOR_HOURLY_RATE_RESPONSE_TOPIC = "tutor_hourly_rate_response";

    public void sendTutorHourlyRateResponse(TutorHourlyRateResponseEvent event) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(TUTOR_HOURLY_RATE_RESPONSE_TOPIC, event.getClassId().toString(), jsonMessage);
            log.info("Sent tutor hourly rate response to topic {}: classId={}, hourlyRate={}",
                    TUTOR_HOURLY_RATE_RESPONSE_TOPIC, event.getClassId(), event.getHourlyRate());
        } catch (JsonProcessingException e) {
            log.error("Error converting TutorHourlyRateResponseEvent to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize TutorHourlyRateResponseEvent", e);
        }
    }
}