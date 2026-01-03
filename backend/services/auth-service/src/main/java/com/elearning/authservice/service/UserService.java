package com.elearning.authservice.service;

import com.elearning.authservice.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    
    /**
     * Get user by ID from Keycloak
     */
    UserResponse getUserById(String userId);
    
    /**
     * Get multiple users by IDs
     */
    List<UserResponse> getUsersByIds(List<String> userIds);
    
    /**
     * Update user avatar URL
     */
    void updateUserAvatar(String userId, String avatarUrl);
}
