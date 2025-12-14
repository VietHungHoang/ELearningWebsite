package com.elearning.authservice.service.impl;

import com.elearning.authservice.dto.request.LoginRequest;
import com.elearning.authservice.dto.request.RefreshTokenRequest;
import com.elearning.authservice.dto.response.LoginResponse;
import com.elearning.authservice.exception.AuthenticationFailedException;
import com.elearning.authservice.service.LoginService;
import com.elearning.authservice.config.KeycloakProperties;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoginServiceImpl implements LoginService {

    private final RestTemplate restTemplate;
    private final KeycloakProperties keycloakProperties;

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
                    new ParameterizedTypeReference<>() {
                    }
            );
            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> bodyMap = response.getBody();
                if (Objects.isNull(bodyMap)) {
                    throw new AuthenticationFailedException("Login failed: Empty response body", response.getStatusCode(), "Empty body");
                }
                return buildLoginResponse(bodyMap);
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
                    new ParameterizedTypeReference<>() {
                    }
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> bodyMap = response.getBody();
                if (Objects.isNull(bodyMap)) {
                    throw new AuthenticationFailedException("Token refresh failed: Empty response body", response.getStatusCode(), "Empty body");
                }
                return buildLoginResponse(bodyMap);
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