package com.elearning.authservice.service.impl;

import com.elearning.authservice.dto.event.TutorRoleAssignedEvent;
import com.elearning.authservice.entity.Role;
import com.elearning.authservice.service.RoleService;
import com.elearning.authservice.kafka.KafkaProducer;
import com.elearning.authservice.config.KeycloakProperties;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoleServiceImpl implements RoleService {

    private final Keycloak keycloak;
    private final KafkaProducer kafkaProducer;
    private final KeycloakProperties keycloakProperties;

    @Override
    public void assignTutorRole(String userId) {
        log.info("Assigning TUTOR role to user: {}", userId);

        try {
            RealmResource realmResource = keycloak.realm(keycloakProperties.getRealm());
            UsersResource usersResource = realmResource.users();
            UserResource userResource = usersResource.get(userId);

            // Get TUTOR role from realm
            var roleResource = realmResource.roles().get(Role.TUTOR.toValue());
            var roleRepresentation = roleResource.toRepresentation();

            // Assign TUTOR role to user
            userResource.roles().realmLevel().add(Collections.singletonList(roleRepresentation));

            log.info("Successfully assigned TUTOR role to user: {}", userId);

            // Send Kafka event to tutor service for approval process
            TutorRoleAssignedEvent event = TutorRoleAssignedEvent.builder()
                    .userId(userId)
                    .build();
            kafkaProducer.sendTutorRoleAssignedEvent(event);
            log.info("Sent tutor role assigned event for user: {}", userId);
        } catch (Exception e) {
            log.error("Failed to assign TUTOR role to user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to assign TUTOR role to user", e);
        }
    }
}