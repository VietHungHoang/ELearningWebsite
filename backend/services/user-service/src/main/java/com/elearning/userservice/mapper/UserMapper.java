package com.elearning.userservice.mapper;

import com.elearning.userservice.dto.request.CreateUserRequest;
import com.elearning.userservice.dto.response.UserResponse;
import com.elearning.userservice.model.User;

public class UserMapper {

    /**
     * Convert User entity to UserResponse DTO
     */
    public static UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    /**
     * Convert CreateUserRequest DTO to User entity
     */
    public static User toEntity(CreateUserRequest request) {
        if (request == null) {
            return null;
        }

        return User.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .bio(request.getBio())
                .role(request.getRole())
                .build();
    }

    /**
     * Update existing User entity with data from CreateUserRequest
     */
    public static User updateEntity(User existingUser, CreateUserRequest request) {
        if (existingUser == null || request == null) {
            return existingUser;
        }

        return User.builder()
                .id(existingUser.getId()) // Keep existing ID
                .email(request.getEmail())
                .fullName(request.getFullName())
                .bio(request.getBio())
                .avatarUrl(existingUser.getAvatarUrl()) // Keep existing avatar
                .role(request.getRole())
                .status(existingUser.getStatus()) // Keep existing status
                .createdAt(existingUser.getCreatedAt()) // Keep creation time
                .build();
    }
}
