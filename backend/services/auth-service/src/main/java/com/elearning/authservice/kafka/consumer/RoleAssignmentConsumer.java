package com.elearning.authservice.kafka.consumer;

import com.elearning.authservice.dto.event.RoleAssignRequestEvent;
import com.elearning.authservice.entity.Role;
import com.elearning.authservice.config.KeycloakProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoleAssignmentConsumer {

    private final ObjectMapper objectMapper;
    private final Keycloak keycloak;
    private final KeycloakProperties keycloakProperties;

    private static final String ROLE_ASSIGN_REQUEST_TOPIC = "tutor_role_assign_request";

    @KafkaListener(topics = ROLE_ASSIGN_REQUEST_TOPIC, groupId = "auth-service-group")
    public void handleRoleAssignRequest(String message) {
        log.info("Received role assignment request: {}", message);
        try {
            RoleAssignRequestEvent event = objectMapper.readValue(message, RoleAssignRequestEvent.class);
            log.info("Processing role assignment: userId={}, role={}", event.getUserId(), event.getRole());

            // Convert string role to Role enum
            Role role = Role.fromString(event.getRole());
            
            // Assign role using Keycloak
            assignRoleToUser(event.getUserId().toString(), role);
            
            log.info("Successfully assigned role {} to user {}", event.getRole(), event.getUserId());
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize role assign request event: {}", message, e);
        } catch (IllegalArgumentException e) {
            log.error("Invalid role in request: {}", message, e);
        } catch (Exception e) {
            log.error("Failed to process role assignment request: {}", message, e);
        }
    }

    private void assignRoleToUser(String userId, Role role) {
        try {
            RealmResource realmResource = keycloak.realm(keycloakProperties.getRealm());
            UsersResource usersResource = realmResource.users();
            UserResource userResource = usersResource.get(userId);

            // Get role from realm
            var roleResource = realmResource.roles().get(role.toValue());
            var roleRepresentation = roleResource.toRepresentation();

            // Assign role to user
            userResource.roles().realmLevel().add(Collections.singletonList(roleRepresentation));

            log.info("Assigned role {} to user ID {}", role.toValue(), userId);
        } catch (Exception e) {
            log.error("Failed to assign role {} to user ID {}: {}", role.toValue(), userId, e.getMessage(), e);
        }
    }
}
