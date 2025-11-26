package com.elearning.userservice.service.impl;

import com.elearning.userservice.dto.event.TutorProfileUpdatedEvent;
import com.elearning.userservice.dto.response.UserInfoResponse;
import com.elearning.userservice.entity.User;
import com.elearning.userservice.repository.UserRepository;
import com.elearning.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    
    @Override
    @Transactional(readOnly = true)
    public Map<UUID, UserInfoResponse> batchGetUsers(List<UUID> ids) {
        log.info("Batch retrieving {} users", ids.size());
        
        List<User> users = userRepository.findAllById(ids);
        
        return users.stream()
            .collect(Collectors.toMap(
                User::getId,
                user -> UserInfoResponse.builder()
                    .id(user.getId())
                    .name(user.getFullname())
                    .email(user.getEmail())
                    .avatarUrl(user.getAvatarUrl())
                    .phone(user.getPhone())
                    .gender(user.getGender())
                    .countryId(user.getCountryId())
                    .city(user.getCity())
                    .build()
            ));
    }
    
    @Override
    @Transactional
    public void updateTutorProfile(TutorProfileUpdatedEvent event) {
        log.info("Updating tutor profile for user: {}", event.getTutorId());
        
        User user = userRepository.findById(event.getTutorId())
            .orElseThrow(() -> new RuntimeException("User not found: " + event.getTutorId()));
        
        // Update user information
        user.setFullname(event.getFullName());
        user.setPhone(event.getPhone());
        user.setGender(event.getGender());
        // Note: countryId and city are not updated here as they might be handled differently
        
        userRepository.save(user);
        log.info("Successfully updated tutor profile for user: {}", event.getTutorId());
    }
}
