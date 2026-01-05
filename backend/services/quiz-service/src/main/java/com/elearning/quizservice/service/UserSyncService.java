package com.elearning.quizservice.service;

import com.elearning.quizservice.entity.User;
import com.elearning.quizservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service for managing denormalized user data
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserSyncService {
    
    private final UserRepository userRepository;
    // TODO: Inject UserServiceClient to fetch from user-service if needed
    
    /**
     * Save or update user info (called from controllers when user info is provided)
     */
    @Transactional
    public void saveOrUpdateUser(UUID userId, String fullName, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElse(User.builder()
                        .id(userId)
                        .fullName(fullName)
                        .avatarUrl(avatarUrl)
                        .build());
        
        user.setFullName(fullName);
        user.setAvatarUrl(avatarUrl);
        
        userRepository.save(user);
        log.debug("Saved/Updated user info: {}", userId);
    }
}
