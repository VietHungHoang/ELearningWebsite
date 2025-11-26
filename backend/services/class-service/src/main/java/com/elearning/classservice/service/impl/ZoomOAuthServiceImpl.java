package com.elearning.classservice.service.impl;

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

import com.elearning.classservice.config.ZoomProperties;
import com.elearning.classservice.dto.zoom.ZoomOAuthTokenResponse;
import com.elearning.classservice.entity.TutorZoomCredential;
import com.elearning.classservice.exception.ZoomOAuthException;
import com.elearning.classservice.repository.TutorZoomCredentialRepository;
import com.elearning.classservice.service.ZoomOAuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
        log.info("Generating Zoom OAuth URL for tutor: {}", tutorId);
        
        String authorizeUrl = zoomProperties.getOauth().getAuthorizeUrl();
        String clientId = zoomProperties.getOauth().getClientId();
        String redirectUri = zoomProperties.getOauth().getRedirectUri();
        
        return String.format("%s?response_type=code&client_id=%s&redirect_uri=%s&state=%s",
                authorizeUrl, clientId, redirectUri, tutorId.toString());
    }

    @Override
    @Transactional
    public void handleCallback(String code, UUID tutorId) {
        log.info("Handling Zoom OAuth callback for tutor: {}", tutorId);
        
        try {
            // Exchange authorization code for access token
            ZoomOAuthTokenResponse tokenResponse = exchangeCodeForToken(code);
            
            // Calculate expiry time
            LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(tokenResponse.getExpiresIn());
            
            // Check if credential exists
            TutorZoomCredential credential = credentialRepository.findByTutorId(tutorId)
                    .orElse(TutorZoomCredential.builder()
                            .tutorId(tutorId)
                            .build());
            
            // Update credentials
            credential.setAccessToken(tokenResponse.getAccessToken());
            credential.setRefreshToken(tokenResponse.getRefreshToken());
            credential.setExpiresAt(expiresAt);
            
            credentialRepository.save(credential);
            
            log.info("Successfully saved Zoom credentials for tutor: {}", tutorId);
            
        } catch (Exception e) {
            log.error("Failed to handle OAuth callback for tutor {}: {}", tutorId, e.getMessage(), e);
            throw new ZoomOAuthException("Failed to exchange authorization code", e);
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
    public boolean isConnected(UUID tutorId) {
        return credentialRepository.existsByTutorId(tutorId);
    }

    @Override
    @Transactional
    public void disconnectZoom(UUID tutorId) {
        log.info("Disconnecting Zoom for tutor: {}", tutorId);
        credentialRepository.deleteByTutorId(tutorId);
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
