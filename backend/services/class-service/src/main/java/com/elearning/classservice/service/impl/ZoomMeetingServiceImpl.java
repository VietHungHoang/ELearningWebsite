package com.elearning.classservice.service.impl;

import com.elearning.classservice.config.ZoomProperties;
import com.elearning.classservice.dto.zoom.CreateZoomMeetingRequest;
import com.elearning.classservice.dto.zoom.ZoomMeetingResponse;
import com.elearning.classservice.entity.Session;
import com.elearning.classservice.exception.ZoomApiException;
import com.elearning.classservice.service.ZoomMeetingService;
import com.elearning.classservice.service.ZoomOAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ZoomMeetingServiceImpl implements ZoomMeetingService {

    private final ZoomProperties zoomProperties;
    private final ZoomOAuthService oauthService;
    private final RestTemplate restTemplate;

    private static final DateTimeFormatter ZOOM_DATE_FORMAT = 
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");

    @Override
    public ZoomMeetingResponse createScheduledMeeting(UUID tutorId, Session session) {
        log.info("Creating Zoom meeting for session {} by tutor {}", session.getId(), tutorId);
        
        try {
            // Get valid access token
            String accessToken = oauthService.getValidAccessToken(tutorId);
            
            // Prepare request
            CreateZoomMeetingRequest request = buildMeetingRequest(session);
            
            // Call Zoom API
            String apiUrl = zoomProperties.getApi().getBaseUrl() + "/users/me/meetings";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);
            
            HttpEntity<CreateZoomMeetingRequest> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<ZoomMeetingResponse> response = restTemplate.postForEntity(
                    apiUrl, entity, ZoomMeetingResponse.class);
            
            if (response.getStatusCode() == HttpStatus.CREATED && response.getBody() != null) {
                log.info("Successfully created Zoom meeting {} for session {}", 
                        response.getBody().getId(), session.getId());
                return response.getBody();
            } else {
                throw new ZoomApiException("Failed to create meeting: " + response.getStatusCode());
            }
            
        } catch (Exception e) {
            log.error("Error creating Zoom meeting for session {}: {}", session.getId(), e.getMessage(), e);
            throw new ZoomApiException("Failed to create Zoom meeting", e);
        }
    }

    @Override
    public ZoomMeetingResponse getMeetingDetails(UUID tutorId, String meetingId) {
        log.info("Getting Zoom meeting details for meeting {} by tutor {}", meetingId, tutorId);
        
        try {
            String accessToken = oauthService.getValidAccessToken(tutorId);
            
            String apiUrl = zoomProperties.getApi().getBaseUrl() + "/meetings/" + meetingId;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            
            ResponseEntity<ZoomMeetingResponse> response = restTemplate.exchange(
                    apiUrl, HttpMethod.GET, entity, ZoomMeetingResponse.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            } else {
                throw new ZoomApiException("Failed to get meeting details: " + response.getStatusCode());
            }
            
        } catch (Exception e) {
            log.error("Error getting meeting details for {}: {}", meetingId, e.getMessage(), e);
            throw new ZoomApiException("Failed to get meeting details", e);
        }
    }

    @Override
    public void deleteMeeting(UUID tutorId, String meetingId) {
        log.info("Deleting Zoom meeting {} by tutor {}", meetingId, tutorId);
        
        try {
            String accessToken = oauthService.getValidAccessToken(tutorId);
            
            String apiUrl = zoomProperties.getApi().getBaseUrl() + "/meetings/" + meetingId;
            
           HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Void> response = restTemplate.exchange(
                    apiUrl, HttpMethod.DELETE, entity, Void.class);
            
            if (response.getStatusCode() == HttpStatus.NO_CONTENT) {
                log.info("Successfully deleted Zoom meeting {}", meetingId);
            } else {
                throw new ZoomApiException("Failed to delete meeting: " + response.getStatusCode());
            }
            
        } catch (Exception e) {
            log.error("Error deleting meeting {}: {}", meetingId, e.getMessage(), e);
            throw new ZoomApiException("Failed to delete meeting", e);
        }
    }

    /**
     * Build Zoom meeting request from session entity
     */
    private CreateZoomMeetingRequest buildMeetingRequest(Session session) {
        String topic = session.getTitle() != null ? session.getTitle() : "Class Session";
        if (session.getIsTrial()) {
            topic = "Trial Session - " + topic;
        }
        
        // Calculate duration in minutes
        long durationMinutes = java.time.Duration.between(
                session.getStartTime(), session.getEndTime()).toMinutes();
        
        if (durationMinutes <= 0) {
            durationMinutes = zoomProperties.getMeeting().getDefaultDuration();
        }
        
        CreateZoomMeetingRequest.Settings settings = CreateZoomMeetingRequest.Settings.builder()
                .hostVideo(true)
                .participantVideo(true)
                .joinBeforeHost(false)
                .muteUponEntry(false)
                .waitingRoom(zoomProperties.getMeeting().getWaitingRoom())
                .audio("both")
                .autoRecording("none")
                .build();
        
        return CreateZoomMeetingRequest.builder()
                .topic(topic)
                .type(2) // Scheduled meeting
                .startTime(session.getStartTime().format(ZOOM_DATE_FORMAT))
                .duration(Math.toIntExact(durationMinutes))
                .timezone("Asia/Ho_Chi_Minh")
                .agenda("E-learning class session")
                .settings(settings)
                .build();
    }
}
