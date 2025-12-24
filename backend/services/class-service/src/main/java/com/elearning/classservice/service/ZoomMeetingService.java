package com.elearning.classservice.service;

import java.util.UUID;

import com.elearning.classservice.dto.zoom.response.ZoomMeetingResponse;

/**
 * Service for managing Zoom meetings via Zoom API
 */
public interface ZoomMeetingService {
    
    /**
     * Create a scheduled Zoom meeting for a session
     * @param tutorId tutor ID (to get access token)
     * @param sessionId session entity with start/end time
     * @return Zoom meeting details
     */
    ZoomMeetingResponse createScheduledMeeting(UUID tutorId, UUID sessionId);
    
    /**
     * Get meeting details from Zoom
     * @param tutorId tutor ID
     * @param meetingId Zoom meeting ID
     * @return meeting details
     */
    ZoomMeetingResponse getMeetingDetails(UUID tutorId, String meetingId);
    
    /**
     * Delete a Zoom meeting
     * @param tutorId tutor ID
     * @param meetingId Zoom meeting ID
     */
    void deleteMeeting(UUID tutorId, String meetingId);
}
