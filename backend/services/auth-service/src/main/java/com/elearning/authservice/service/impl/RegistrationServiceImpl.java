package com.elearning.authservice.service.impl;

import com.elearning.authservice.dto.event.AccountCreatedEvent;
import com.elearning.authservice.dto.event.EmailOtpEvent;
import com.elearning.authservice.dto.request.RegistrationStartRequest;
import com.elearning.authservice.dto.request.SetPasswordRequest;
import com.elearning.authservice.dto.request.VerifyOtpRequest;
import com.elearning.authservice.dto.response.AccountCreatedResponse;
import com.elearning.authservice.entity.Role;
import com.elearning.authservice.exception.InvalidTokenException;
import com.elearning.authservice.service.RegistrationService;
import com.elearning.authservice.kafka.KafkaProducer;
import com.elearning.authservice.config.KeycloakProperties;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import jakarta.ws.rs.core.Response;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Implementation of RegistrationService for user registration operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationServiceImpl implements RegistrationService {

    private final Keycloak keycloak;
    private final StringRedisTemplate redisTemplate;
    private final KafkaProducer kafkaProducer;
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

        // String otp = String.format("%06d", (int) (Math.random() * 1000000));
        String otp = "000000";
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
    public AccountCreatedResponse createAccount(SetPasswordRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();
        Role role = request.getRole();
        String fullName = validateRegistrationSession(email);
        String userId = createUserInKeycloak(email, password, fullName);

        if (role != null && role != Role.TUTOR) {
            assignRoleToUser(userId, role, email);
        }
        sendAccountCreatedEvent(userId, email, fullName, role);
        cleanupRegistrationSession(email);

        return AccountCreatedResponse.builder()
                .id(userId)
                .email(email)
                .fullName(fullName)
                .build();
    }

    private String validateRegistrationSession(String email) {
        String fullName = redisTemplate.opsForValue().get("reg_name:" + email);
        if (fullName == null) {
            throw new InvalidTokenException("Registration session expired or not found");
        }
        return fullName;
    }

    private String createUserInKeycloak(String email, String password, String fullname) {
        RealmResource realmResource = keycloak.realm(keycloakProperties.getRealm());
        UsersResource usersResource = realmResource.users();

        UserRepresentation user = getUserRepresentation(email, password, fullname);

        Response response = usersResource.create(user);
        if (response.getStatus() != 201) {
            throw new RuntimeException("Failed to create user in Keycloak");
        }

        // Get user ID from response
        return response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");
    }

    private UserRepresentation getUserRepresentation(String email, String password, String fullname) {
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
        user.setCredentials(List.of(credential));
        return user;
    }

    private void assignRoleToUser(String userId, Role role, String email) {
        try {
            RealmResource realmResource = keycloak.realm(keycloakProperties.getRealm());
            UsersResource usersResource = realmResource.users();
            UserResource userResource = usersResource.get(userId);

            // Get role from realm (use lowercase role name)
            var roleResource = realmResource.roles().get(role.toValue());
            var roleRepresentation = roleResource.toRepresentation();

            // Assign role to user
            userResource.roles().realmLevel().add(Collections.singletonList(roleRepresentation));

            log.info("Assigned role {} to user {}", role.toValue(), email);
        } catch (Exception e) {
            log.error("Failed to assign role {} to user {}: {}", role.toValue(), email, e.getMessage());
            throw new RuntimeException("Failed to assign role to user", e);
        }
    }

    private void sendAccountCreatedEvent(String userId, String email, String fullname, Role role) {
        try {
            AccountCreatedEvent event = AccountCreatedEvent.builder()
                    .id(userId)
                    .email(email)
                    .fullName(fullname)
                    .role(role != null ? role.toValue() : null)
                    .build();
            kafkaProducer.sendAccountCreatedEvent(event);
            log.info("Sent account created event for user: {}", email);
        } catch (Exception e) {
            log.error("Failed to send account created event for {}: {}", email, e.getMessage(), e);
        }
    }

    private void cleanupRegistrationSession(String email) {
        redisTemplate.delete("reg_name:" + email);
    }
}