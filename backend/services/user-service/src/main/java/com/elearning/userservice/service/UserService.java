package com.elearning.userservice.service;

import com.elearning.userservice.dto.event.TutorProfileUpdatedEvent;
import com.elearning.userservice.dto.response.UserInfoResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service interface for user operations
 */
public interface UserService {
    
    /**
     * Batch retrieve users by their IDs
     * @param ids List of user IDs
     * @return Map of ID to user information
     */
    Map<UUID, UserInfoResponse> batchGetUsers(List<UUID> ids);
    
    /**
     * Update tutor profile information
     * @param event Tutor profile updated event
     */
    void updateTutorProfile(TutorProfileUpdatedEvent event);
}
