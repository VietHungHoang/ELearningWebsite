package com.elearning.chatservice.service;

import com.elearning.chatservice.dto.UserInfo;
import com.elearning.chatservice.entity.UserCache;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service interface for managing user cache
 */
public interface UserCacheService {

    /**
     * Save or update multiple users in cache
     */
    void saveOrUpdateUsers(List<UserInfo> users);

    /**
     * Get users by their IDs as a map for easy lookup
     */
    Map<UUID, UserCache> getUsersByIds(List<UUID> userIds);

    /**
     * Get a single user by ID
     */
    UserCache getUser(UUID userId);
}
