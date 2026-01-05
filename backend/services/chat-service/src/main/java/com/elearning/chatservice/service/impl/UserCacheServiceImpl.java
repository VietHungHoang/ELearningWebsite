package com.elearning.chatservice.service.impl;

import com.elearning.chatservice.dto.UserInfo;
import com.elearning.chatservice.entity.UserCache;
import com.elearning.chatservice.repository.UserCacheRepository;
import com.elearning.chatservice.service.UserCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of UserCacheService
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserCacheServiceImpl implements UserCacheService {

    private final UserCacheRepository userCacheRepository;

    @Override
    public void saveOrUpdateUsers(List<UserInfo> users) {
        if (users == null || users.isEmpty()) {
            return;
        }

        List<UserCache> cacheEntries = users.stream()
                .filter(u -> u.getId() != null && u.getFullName() != null)
                .map(u -> UserCache.builder()
                        .id(u.getId())
                        .fullName(u.getFullName())
                        .avatarUrl(u.getAvatarUrl())
                        .updatedAt(LocalDateTime.now())
                        .build())
                .toList();

        if (!cacheEntries.isEmpty()) {
            userCacheRepository.saveAll(cacheEntries);
            log.debug("Saved {} users to cache", cacheEntries.size());
        }
    }

    @Override
    public Map<UUID, UserCache> getUsersByIds(List<UUID> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Map.of();
        }

        return userCacheRepository.findByIdIn(userIds).stream()
                .collect(Collectors.toMap(UserCache::getId, u -> u));
    }

    @Override
    public UserCache getUser(UUID userId) {
        if (userId == null) {
            return null;
        }
        return userCacheRepository.findById(userId).orElse(null);
    }
}
