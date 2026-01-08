package com.elearning.classservice.service;

import java.util.UUID;

public interface ZoomAsyncService {
    
    /**
     * Asynchronously create Zoom meetings for all sessions of a class
     * This method runs in a separate thread and doesn't block the caller
     */
    void createZoomMeetingsForClassAsync(UUID classId);
}
