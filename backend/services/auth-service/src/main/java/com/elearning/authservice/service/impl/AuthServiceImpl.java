package com.elearning.authservice.service.impl;

import com.elearning.authservice.client.NotificationClient;
import com.elearning.authservice.dto.request.RegistrationStartRequest;
import com.elearning.authservice.dto.request.SetPasswordRequest;
import com.elearning.authservice.dto.request.VerifyOtpRequest;
import com.elearning.authservice.dto.response.VerifyOtpResponse;
import com.elearning.authservice.exception.InvalidTokenException;
import com.elearning.authservice.service.AuthService;
import com.elearning.authservice.util.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import jakarta.ws.rs.core.Response;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final StringRedisTemplate redisTemplate;
    private final NotificationClient notificationClient;
    private final JwtUtil jwtUtil;
    private final Keycloak keycloak;

    @Override
    public void startRegistration(RegistrationStartRequest request) {
        String email = request.getEmail();
        String fullname = request.getFullname();

        String otp = String.format("%06d", (int) (Math.random() * 1000000));
        redisTemplate.opsForValue().set("reg:" + email, otp, 300, TimeUnit.SECONDS);
        redisTemplate.opsForValue().set("reg_name:" + email, fullname, 300, TimeUnit.SECONDS);
        notificationClient.sendOtpEmail(email, otp);
    }

    @Override
    public VerifyOtpResponse verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp();

        String storedOtp = redisTemplate.opsForValue().get("reg:" + email);
        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new IllegalArgumentException("OTP sai");
        }

        // Delete the OTP
        redisTemplate.delete("reg:" + email);

        // Create internal JWT token (10 min expiry)
        String token = jwtUtil.generateToken(email);

        return new VerifyOtpResponse(token);
    }

    @Override
    public void setPassword(String token, SetPasswordRequest request) {
        // Remove "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // Validate JWT token
        if (!jwtUtil.validateToken(token)) {
            throw new InvalidTokenException("Invalid or expired token");
        }

        // Extract email from token
        String email = jwtUtil.extractEmail(token);
        if (email == null) {
            throw new InvalidTokenException("Email not found in token");
        }

        // Get fullname from Redis
        String fullname = redisTemplate.opsForValue().get("reg_name:" + email);
        if (fullname == null) {
            throw new InvalidTokenException("Registration session expired or not found");
        }

        // Create user in Keycloak
        RealmResource realmResource = keycloak.realm("elearning");
        UsersResource usersResource = realmResource.users();

        UserRepresentation user = new UserRepresentation();
        user.setUsername(email);
        user.setEmail(email);
        user.setFirstName(fullname.split(" ")[0]);
        user.setLastName(fullname.substring(fullname.indexOf(" ") + 1));
        user.setEnabled(true);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(request.getPassword());
        credential.setTemporary(false);
        user.setCredentials(Arrays.asList(credential));

        Response response = usersResource.create(user);
        if (response.getStatus() != 201) {
            throw new RuntimeException("Failed to create user in Keycloak");
        }

        // Clean up Redis
        redisTemplate.delete("reg_name:" + email);
    }
}