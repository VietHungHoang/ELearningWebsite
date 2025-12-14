package com.elearning.authservice.service.impl;

import com.elearning.authservice.dto.event.AccountCreatedEvent;
import com.elearning.authservice.dto.request.GoogleLoginRequest;
import com.elearning.authservice.dto.response.LoginResponse;
import com.elearning.authservice.exception.AuthenticationFailedException;
import com.elearning.authservice.service.OAuthService;
import com.elearning.authservice.kafka.KafkaProducer;
import com.elearning.authservice.config.KeycloakProperties;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuthServiceImpl implements OAuthService {

    private final RestTemplate restTemplate;
    private final Keycloak keycloak;
    private final KafkaProducer kafkaProducer;
    private final KeycloakProperties keycloakProperties;

    @Override
    public String getGoogleAuthUrl(String redirectUri) {
        // Build Keycloak's Google OAuth URL (use public URL for browser access)
        String authUrl = String.format(
                "%s/realms/%s/protocol/openid-connect/auth?client_id=%s&redirect_uri=%s&response_type=code&scope=openid email profile&kc_idp_hint=google",
                keycloakProperties.getPublicUrl(),
                keycloakProperties.getRealm(),
                keycloakProperties.getResource(),
                redirectUri
        );
        log.info("Generated Google auth URL: {}", authUrl);
        return authUrl;
    }

    @Override
    public LoginResponse loginWithGoogle(GoogleLoginRequest request) {
        log.info("Processing Google login with code");
        String tokenUrl = keycloakProperties.getAuthServerUrl() + "/realms/" + keycloakProperties.getRealm() + "/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", keycloakProperties.getResource());
        body.add("client_secret", keycloakProperties.getClientSecret());
        body.add("code", request.getCode());
        body.add("redirect_uri", request.getRedirectUri());

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    tokenUrl,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<>() {
                    }
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> bodyMap = response.getBody();
                if (bodyMap == null) {
                    throw new AuthenticationFailedException("Empty response from Keycloak", response.getStatusCode(), "No body");
                }
                String accessToken = (String) bodyMap.get("access_token");

                // Decode JWT to get user email
                String email = extractEmailFromToken(accessToken);
                log.info("Extracted email from token: {}", email);

                // Check if user is new (first-time login)
                RealmResource realmResource = keycloak.realm(keycloakProperties.getRealm());
                UsersResource usersResource = realmResource.users();
                List<UserRepresentation> existingUsers = usersResource.searchByEmail(email, true);

                if (!existingUsers.isEmpty() && request.getRole() != null) {
                    // User exists and role is provided -> assign role if not already assigned
                    UserRepresentation user = existingUsers.get(0);
                    String userId = user.getId();

                    try {
                        var userResource = usersResource.get(userId);
                        var existingRoles = userResource.roles().realmLevel().listEffective();

                        // Check if user already has the role
                        boolean hasRole = existingRoles.stream()
                                .anyMatch(r -> r.getName().equals(request.getRole().toValue()));

                        if (!hasRole) {
                            // Assign role
                            var roleResource = realmResource.roles().get(request.getRole().toValue());
                            var roleRepresentation = roleResource.toRepresentation();
                            userResource.roles().realmLevel().add(Collections.singletonList(roleRepresentation));
                            log.info("Assigned role {} to existing user {}", request.getRole().toValue(), email);

                            // Send account created event for first-time role assignment
                            try {
                                String fullname = (user.getFirstName() != null ? user.getFirstName() : "") +
                                        " " +
                                        (user.getLastName() != null ? user.getLastName() : "");
                                AccountCreatedEvent event = AccountCreatedEvent.builder()
                                        .id(userId)
                                        .email(email)
                                        .fullName(fullname.trim())
                                        .role(request.getRole().toValue())
                                        .build();
                                kafkaProducer.sendAccountCreatedEvent(event);
                                log.info("Sent account created event for Google user: {}", email);
                            } catch (Exception e) {
                                log.error("Failed to send account created event for {}: {}", email, e.getMessage(), e);
                            }
                        } else {
                            log.info("User {} already has role {}", email, request.getRole().toValue());
                        }
                    } catch (Exception e) {
                        log.error("Failed to assign role to user {}: {}", email, e.getMessage());
                        // Continue anyway - don't fail the login
                    }
                }

                LoginResponse loginResponse = buildLoginResponse(bodyMap);
                log.info("Google login successful for user: {}", email);
                return loginResponse;
            } else {
                Map<String, Object> errorBody = response.getBody();
                String errorJson = errorBody != null ? errorBody.toString() : "No body";
                log.warn("Google login failed: {} - {}", response.getStatusCode(), errorJson);

                String message = getErrorMessage(response.getStatusCode().value());
                throw new AuthenticationFailedException(message, response.getStatusCode(), errorJson);
            }
        } catch (Exception e) {
            log.error("Google login API call failed: {}", e.getMessage(), e);
            throw new RuntimeException("Google login failed due to Keycloak API call error: " + e.getMessage(), e);
        }
    }

    private LoginResponse buildLoginResponse(Map<String, Object> bodyMap) {
        return LoginResponse.builder()
                .accessToken((String) bodyMap.get("access_token"))
                .refreshToken((String) bodyMap.get("refresh_token"))
                .tokenType((String) bodyMap.get("token_type"))
                .expiresIn((Integer) bodyMap.get("expires_in"))
                .scope((String) bodyMap.get("scope"))
                .build();
    }

    private String extractEmailFromToken(String token) {
        // Decode JWT token to extract email (simple base64 decode of payload)
        try {
            String[] parts = token.split("\\.");
            if (parts.length < 2) {
                throw new RuntimeException("Invalid JWT token format");
            }

            String payload = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
            // Parse JSON to get email
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            @SuppressWarnings("unchecked")
            Map<String, Object> claims = mapper.readValue(payload, Map.class);

            String email = (String) claims.get("email");
            if (email == null) {
                email = (String) claims.get("preferred_username");
            }

            return email;
        } catch (Exception e) {
            log.error("Failed to extract email from token: {}", e.getMessage());
            throw new RuntimeException("Failed to decode token", e);
        }
    }

    private String getErrorMessage(int statusCode) {
        return switch (statusCode) {
            case 400 -> "Bad request: Invalid parameters";
            case 401 -> "Unauthorized: Invalid credentials";
            case 403 -> "Forbidden: Client not authorized for this grant type";
            case 500 -> "Internal server error: Keycloak server error";
            default -> "Login failed: " + statusCode;
        };
    }
}