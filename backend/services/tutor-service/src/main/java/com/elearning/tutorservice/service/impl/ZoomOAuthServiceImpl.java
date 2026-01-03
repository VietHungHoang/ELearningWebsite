package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.config.ZoomProperties;
import com.elearning.tutorservice.dto.zoom.response.ZoomOAuthTokenResponse;
import com.elearning.tutorservice.entity.TutorZoomCredential;
import com.elearning.tutorservice.exception.ZoomOAuthException;
import com.elearning.tutorservice.repository.TutorZoomCredentialRepository;
import com.elearning.tutorservice.service.ZoomOAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ZoomOAuthServiceImpl implements ZoomOAuthService {

    private final ZoomProperties zoomProperties;
    private final TutorZoomCredentialRepository credentialRepository;
    private final RestTemplate restTemplate;

    @Override
    public String getAuthorizationUrl(UUID tutorId) {
        String authorizeUrl = zoomProperties.getOauth().getAuthorizeUrl();
        String clientId = zoomProperties.getOauth().getClientId();
        String redirectUri = zoomProperties.getOauth().getRedirectUri();
        return String.format("%s?response_type=code&client_id=%s&redirect_uri=%s&state=%s",
                authorizeUrl, clientId, redirectUri, tutorId.toString());
    }

    @Override
    @Transactional
    public void processOAuthCallback(String code, String state) {
        log.info("Processing Zoom OAuth callback for state: {}", state);
        
        try {
            UUID tutorId = UUID.fromString(state);
            
            // Exchange code for token
            ZoomOAuthTokenResponse tokenResponse = exchangeCodeForToken(code);
            
            // Save or update credentials
            TutorZoomCredential credential = credentialRepository.findByTutorId(tutorId)
                    .orElse(TutorZoomCredential.builder().tutorId(tutorId).build());
            
            credential.setAccessToken(tokenResponse.getAccessToken());
            credential.setRefreshToken(tokenResponse.getRefreshToken());
            credential.setExpiresAt(LocalDateTime.now().plusSeconds(tokenResponse.getExpiresIn()));
            
            credentialRepository.save(credential);
            
            log.info("Successfully connected/renewed Zoom credentials for tutor: {}", tutorId);
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid state parameter in OAuth callback: {}", state);
            throw new ZoomOAuthException("Invalid state parameter: " + state);
        } catch (Exception e) {
            log.error("Failed to process OAuth callback: {}", e.getMessage(), e);
            throw new ZoomOAuthException("Failed to process OAuth callback", e);
        }
    }

    @Override
    @Transactional
    public void refreshAccessToken(UUID tutorId) {
        log.info("Refreshing Zoom access token for tutor: {}", tutorId);
        
        TutorZoomCredential credential = credentialRepository.findByTutorId(tutorId)
                .orElseThrow(() -> new ZoomOAuthException("Tutor has not connected Zoom account"));
        
        try {
            ZoomOAuthTokenResponse tokenResponse = refreshToken(credential.getRefreshToken());
            
            // Update credentials
            credential.setAccessToken(tokenResponse.getAccessToken());
            credential.setRefreshToken(tokenResponse.getRefreshToken());
            credential.setExpiresAt(LocalDateTime.now().plusSeconds(tokenResponse.getExpiresIn()));
            
            credentialRepository.save(credential);
            
            log.info("Successfully refreshed access token for tutor: {}", tutorId);
            
        } catch (Exception e) {
            log.error("Failed to refresh token for tutor {}: {}", tutorId, e.getMessage(), e);
            throw new ZoomOAuthException("Failed to refresh access token", e);
        }
    }

    @Override
    public String getValidAccessToken(UUID tutorId) {
        TutorZoomCredential credential = credentialRepository.findByTutorId(tutorId)
                .orElseThrow(() -> new ZoomOAuthException("Tutor has not connected Zoom account. Please connect Zoom first."));
        
        // Check if token is expired
        if (credential.isExpired()) {
            log.info("Access token expired for tutor {}, refreshing...", tutorId);
            refreshAccessToken(tutorId);
            // Reload credential after refresh
            credential = credentialRepository.findByTutorId(tutorId).get();
        }
        
        return credential.getAccessToken();
    }

    /**
     * Exchange authorization code for access token
     */
    private ZoomOAuthTokenResponse exchangeCodeForToken(String code) {
        log.info("Exchanging authorization code for access token");
        
        String tokenUrl = zoomProperties.getOauth().getTokenUrl();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "Basic " + getBasicAuthHeader());

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", code);
        body.add("redirect_uri", zoomProperties.getOauth().getRedirectUri());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<ZoomOAuthTokenResponse> response = restTemplate.postForEntity(
                tokenUrl, request, ZoomOAuthTokenResponse.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return response.getBody();
        } else {
            throw new ZoomOAuthException("Failed to exchange code for token: " + response.getStatusCode());
        }
    }

    /**
     * Refresh access token using refresh token
     */
    private ZoomOAuthTokenResponse refreshToken(String refreshToken) {
        String tokenUrl = zoomProperties.getOauth().getTokenUrl();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "Basic " + getBasicAuthHeader());
        
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("refresh_token", refreshToken);
        
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        
        ResponseEntity<ZoomOAuthTokenResponse> response = restTemplate.postForEntity(
                tokenUrl, request, ZoomOAuthTokenResponse.class);
        
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return response.getBody();
        } else {
            throw new ZoomOAuthException("Failed to refresh token: " + response.getStatusCode());
        }
    }

    /**
     * Generate Basic Auth header (Base64 encoded client_id:client_secret)
     */
    private String getBasicAuthHeader() {
        String clientId = zoomProperties.getOauth().getClientId();
        String clientSecret = zoomProperties.getOauth().getClientSecret();
        String credentials = clientId + ":" + clientSecret;
        return Base64.getEncoder().encodeToString(credentials.getBytes());
    }
}
