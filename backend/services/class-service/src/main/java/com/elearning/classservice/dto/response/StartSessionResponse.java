package com.elearning.classservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Response when starting a session
 * Contains Zoom meeting URLs for host and participants
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StartSessionResponse {
    
    private UUID sessionId;
    
    private String status; // ONGOING
    
    private String zoomJoinUrl; // For students to join
    
    private String zoomStartUrl; // For tutor to start (has zak parameter)
    
    private String zoomMeetingId;
    
    private String zoomPassword;
}
