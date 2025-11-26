package com.elearning.authservice.service.impl;

import com.elearning.authservice.dto.event.AccountCreatedEvent;
import com.elearning.authservice.dto.event.EmailOtpEvent;
import com.elearning.authservice.dto.request.GoogleLoginRequest;
import com.elearning.authservice.dto.request.LoginRequest;
import com.elearning.authservice.dto.request.RefreshTokenRequest;
import com.elearning.authservice.dto.request.RegistrationStartRequest;
import com.elearning.authservice.dto.request.SetPasswordRequest;
import com.elearning.authservice.dto.request.VerifyOtpRequest;
import com.elearning.authservice.entity.Role;
import com.elearning.authservice.dto.response.LoginResponse;
import com.elearning.authservice.exception.AuthenticationFailedException;
import com.elearning.authservice.exception.InvalidTokenException;
import com.elearning.authservice.service.AuthService;
import com.elearning.authservice.service.producer.KafkaProducer;
import com.elearning.authservice.config.KeycloakProperties;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
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
import org.springframework.data.redis.core.StringRedisTemplate;

import jakarta.ws.rs.core.Response;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final StringRedisTemplate redisTemplate;
    private final KafkaProducer kafkaProducer;
    private final Keycloak keycloak;
    private final RestTemplate restTemplate;
    private final KeycloakProperties keycloakProperties;

    @Override
    public void startRegistration(RegistrationStartRequest request) {
        log.info("Starting registration for email: {}", request.getEmail());
        String email = request.getEmail();
        String fullname = request.getFullname();

        // Check if user already exists in Keycloak
        RealmResource realmResource = keycloak.realm(keycloakProperties.getRealm());
        UsersResource usersResource = realmResource.users();

        log.info("Checking if user with email {} in Keycloak, realm: {}, clientSecret: {}", email, keycloakProperties.getRealm(), keycloakProperties.getClientSecret());

        List<UserRepresentation> existingUsers = usersResource.searchByEmail(email, true);
        if (!existingUsers.isEmpty()) {
            log.warn("User with email {} already exists in Keycloak", email);
            throw new IllegalArgumentException("Email đã được đăng ký");
        }

        String otp = String.format("%06d", (int) (Math.random() * 1000000));
        redisTemplate.opsForValue().set("reg:" + email, otp, 300, TimeUnit.SECONDS);
        redisTemplate.opsForValue().set("reg_name:" + email, fullname, 300, TimeUnit.SECONDS);
        kafkaProducer.sendToNotificationOTPEmail(new EmailOtpEvent(email, otp));
    }

    @Override
    public void verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp();
        String storedOtp = redisTemplate.opsForValue().get("reg:" + email);
        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new IllegalArgumentException("OTP sai");
        }
        // Delete the OTP
        redisTemplate.delete("reg:" + email);
    }

    @Override
    public void createAccount(SetPasswordRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();
        Role role = request.getRole();

        // Get fullname from Redis
        String fullname = redisTemplate.opsForValue().get("reg_name:" + email);
        if (fullname == null) {
            throw new InvalidTokenException("Registration session expired or not found");
        }

        // Create user in Keycloak
        RealmResource realmResource = keycloak.realm(keycloakProperties.getRealm());
        UsersResource usersResource = realmResource.users();

        UserRepresentation user = new UserRepresentation();
        user.setUsername(email);
        user.setEmail(email);
        user.setFirstName(fullname.split(" ")[0]);
        user.setLastName(fullname.substring(fullname.indexOf(" ") + 1));
        user.setEnabled(true);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false);
        user.setCredentials(Arrays.asList(credential));

        Response response = usersResource.create(user);
        if (response.getStatus() != 201) {
            throw new RuntimeException("Failed to create user in Keycloak");
        }

        // Get user ID from response
        String userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");

        // Assign role to user
        if (role != null) {
            try {
                UserResource userResource = usersResource.get(userId);

                // Get role from realm (use lowercase role name)
                var roleResource = realmResource.roles().get(role.toValue());
                var roleRepresentation = roleResource.toRepresentation();

                // Assign role to user
                userResource.roles().realmLevel().add(Arrays.asList(roleRepresentation));

                log.info("Assigned role {} to user {}", role.toValue(), email);
            } catch (Exception e) {
                log.error("Failed to assign role {} to user {}: {}", role.toValue(), email, e.getMessage());
                throw new RuntimeException("Failed to assign role to user", e);
            }
        }

        // Produce Kafka event for user-service
        try {
            AccountCreatedEvent event = AccountCreatedEvent.builder()
                    .id(userId)
                    .email(email)
                    .fullname(fullname)
                    .role(role != null ? role.toValue() : null)
                    .build();
            kafkaProducer.sendAccountCreatedEvent(event);
            log.info("Sent account created event for user: {}", email);
        } catch (Exception e) {
            log.error("Failed to send account created event for {}: {}", email, e.getMessage(), e);
        }

        // Clean up Redis
        redisTemplate.delete("reg_name:" + email);
    }
    
    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        String tokenUrl = keycloakProperties.getAuthServerUrl() + "/realms/" + keycloakProperties.getRealm() + "/protocol/openid-connect/token";
        HttpEntity<MultiValueMap<String, String>> entity = buildLoginRequestEntity(request);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                tokenUrl, 
                HttpMethod.POST, 
                entity, 
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> bodyMap = response.getBody();
                LoginResponse loginResponse = buildLoginResponse(bodyMap);
                return loginResponse;
            } else {
                Map<String, Object> errorBody = response.getBody();
                String errorJson = errorBody != null ? errorBody.toString() : "No body";
                log.warn("Login failed for email {}: {} - {}", request.getEmail(), response.getStatusCode(), errorJson);
                
                String message = getErrorMessage(response.getStatusCode().value());
                throw new AuthenticationFailedException(message, response.getStatusCode(), errorJson);
            }
        } catch (Exception e) {
            log.error("Login API call failed for email {}: {}", request.getEmail(), e.getMessage(), e);
            throw new RuntimeException("Login failed due to Jeycloak API call error: " + e.getMessage(), e);
        }
    }
    
    private HttpEntity<MultiValueMap<String, String>> buildLoginRequestEntity(LoginRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id", keycloakProperties.getResource());
        body.add("client_secret", keycloakProperties.getClientSecret());
        body.add("username", request.getEmail());
        body.add("password", request.getPassword());

        return new HttpEntity<>(body, headers);
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
    
    @Override
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        log.info("Refreshing access token");
        String tokenUrl = keycloakProperties.getAuthServerUrl() + "/realms/" + keycloakProperties.getRealm() + "/protocol/openid-connect/token";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("client_id", keycloakProperties.getResource());
        body.add("client_secret", keycloakProperties.getClientSecret());
        body.add("refresh_token", request.getRefreshToken());

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                tokenUrl, 
                HttpMethod.POST, 
                entity, 
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> bodyMap = response.getBody();
                LoginResponse loginResponse = buildLoginResponse(bodyMap);
                log.info("Token refresh successful");
                return loginResponse;
            } else {
                Map<String, Object> errorBody = response.getBody();
                String errorJson = errorBody != null ? errorBody.toString() : "No body";
                log.warn("Token refresh failed: {} - {}", response.getStatusCode(), errorJson);
                
                String message = getErrorMessage(response.getStatusCode().value());
                throw new AuthenticationFailedException(message, response.getStatusCode(), errorJson);
            }
        } catch (Exception e) {
            log.error("Token refresh API call failed: {}", e.getMessage(), e);
            throw new RuntimeException("Token refresh failed: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void bulkCreateAccounts(List<RegistrationStartRequest> requests) {
        RealmResource realmResource = keycloak.realm(keycloakProperties.getRealm());
        UsersResource usersResource = realmResource.users();

        for (RegistrationStartRequest request : requests) {
            UserRepresentation user = new UserRepresentation();
            user.setUsername(request.getEmail());
            user.setEmail(request.getEmail());
            String fullname = request.getFullname();
            user.setFirstName(fullname.split(" ")[0]);
            user.setLastName(fullname.substring(fullname.indexOf(" ") + 1));
            user.setEnabled(true);

            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue("admin"); // Default password
            credential.setTemporary(false);
            user.setCredentials(Arrays.asList(credential));

            Response response = usersResource.create(user);
            if (response.getStatus() != 201) {
                log.error("Failed to create user {} in Keycloak", request.getEmail());
                throw new RuntimeException("Failed to create user in Keycloak");
            }
        }
    }

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
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> bodyMap = response.getBody();
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
                            userResource.roles().realmLevel().add(Arrays.asList(roleRepresentation));
                            log.info("Assigned role {} to existing user {}", request.getRole().toValue(), email);
                            
                            // Send account created event for first-time role assignment
                            try {
                                String fullname = (user.getFirstName() != null ? user.getFirstName() : "") + 
                                                  " " + 
                                                  (user.getLastName() != null ? user.getLastName() : "");
                                AccountCreatedEvent event = AccountCreatedEvent.builder()
                                        .id(userId)
                                        .email(email)
                                        .fullname(fullname.trim())
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
        switch (statusCode) {
            case 400:
                return "Bad request: Invalid parameters";
            case 401:
                return "Unauthorized: Invalid credentials";
            case 403:
                return "Forbidden: Client not authorized for this grant type";
            case 500:
                return "Internal server error: Keycloak server error";
            default:
                return "Login failed: " + statusCode;
        }
    }
}