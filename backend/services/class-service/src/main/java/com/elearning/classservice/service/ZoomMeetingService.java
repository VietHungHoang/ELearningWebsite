package com.elearning.classservice.service;

import com.elearning.classservice.dto.zoom.ZoomMeetingResponse;
import com.elearning.classservice.entity.Session;

import java.util.UUID;

/**
 * Service for managing Zoom meetings via Zoom API
 */
public interface ZoomMeetingService {
    
    /**
     * Create a scheduled Zoom meeting for a session
     * @param tutorId tutor ID (to get access token)
     * @param session session entity with start/end time
     * @return Zoom meeting details
     */
    ZoomMeetingResponse createScheduledMeeting(UUID tutorId, Session session);
    
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
