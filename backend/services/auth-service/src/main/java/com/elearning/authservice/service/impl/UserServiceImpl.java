package com.elearning.authservice.service.impl;

import com.elearning.authservice.config.KeycloakProperties;
import com.elearning.authservice.dto.response.UserResponse;
import com.elearning.authservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final Keycloak keycloak;
    private final KeycloakProperties keycloakProperties;

    @Override
    public UserResponse getUserById(String userId) {
        try {
            UsersResource usersResource = keycloak.realm(keycloakProperties.getRealm()).users();
            UserResource userResource = usersResource.get(userId);
            UserRepresentation user = userResource.toRepresentation();
            
            // Get user roles
            List<RoleRepresentation> roles = userResource.roles().realmLevel().listEffective();
            String role = roles.stream()
                    .map(RoleRepresentation::getName)
                    .filter(r -> r.equals("tutor") || r.equals("student") || r.equals("admin"))
                    .findFirst()
                    .orElse(null);
            
            return mapToUserResponse(user, role);
        } catch (Exception e) {
            log.error("Failed to get user by ID {}: {}", userId, e.getMessage());
            throw new RuntimeException("User not found", e);
        }
    }

    @Override
    public List<UserResponse> getUsersByIds(List<String> userIds) {
        List<UserResponse> users = new ArrayList<>();
        UsersResource usersResource = keycloak.realm(keycloakProperties.getRealm()).users();
        
        for (String userId : userIds) {
            try {
                UserResource userResource = usersResource.get(userId);
                UserRepresentation user = userResource.toRepresentation();
                
                // Get user roles
                List<RoleRepresentation> roles = userResource.roles().realmLevel().listEffective();
                String role = roles.stream()
                        .map(RoleRepresentation::getName)
                        .filter(r -> r.equals("tutor") || r.equals("student") || r.equals("admin"))
                        .findFirst()
                        .orElse(null);
                
                users.add(mapToUserResponse(user, role));
            } catch (Exception e) {
                log.warn("Failed to get user {}: {}", userId, e.getMessage());
                // Continue with other users
            }
        }
        
        return users;
    }

    @Override
    public void updateUserAvatar(String userId, String avatarUrl) {
        try {
            UsersResource usersResource = keycloak.realm(keycloakProperties.getRealm()).users();
            UserResource userResource = usersResource.get(userId);
            UserRepresentation user = userResource.toRepresentation();
            
            // Update picture attribute
            Map<String, List<String>> attributes = user.getAttributes();
            if (attributes == null) {
                attributes = new HashMap<>();
            }
            attributes.put("picture", List.of(avatarUrl));
            user.setAttributes(attributes);
            
            userResource.update(user);
            log.info("Updated avatar for user {}", userId);
        } catch (Exception e) {
            log.error("Failed to update avatar for user {}: {}", userId, e.getMessage());
            throw new RuntimeException("Failed to update avatar", e);
        }
    }

    private UserResponse mapToUserResponse(UserRepresentation user, String role) {
        String avatarUrl = null;
        if (user.getAttributes() != null) {
            List<String> pictureAttr = user.getAttributes().get("picture");
            if (pictureAttr != null && !pictureAttr.isEmpty()) {
                avatarUrl = pictureAttr.get(0);
            }
        }
        
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarUrl(avatarUrl)
                .role(role)
                .build();
    }
}
