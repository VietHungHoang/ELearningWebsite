package com.elearning.userservice.service;

import com.elearning.userservice.dto.request.CreateUserRequest;
import com.elearning.userservice.dto.response.UserResponse;
import com.elearning.userservice.enums.UserRole;
import com.elearning.userservice.enums.UserStatus;

import java.util.List;

public interface IUserService {
    
    UserResponse createUser(CreateUserRequest request);
    
    UserResponse getUserById(Long id);
    
    UserResponse getUserByEmail(String email);
    
    List<UserResponse> getAllUsers();
    
    List<UserResponse> getUsersByRole(UserRole role);
    
    UserResponse updateUser(Long id, CreateUserRequest request);
    
    void deleteUser(Long id);
    
    UserResponse updateUserStatus(Long id, UserStatus status);
    
    List<UserResponse> searchUsersByName(String name);
    
    Long countUsersByRole(UserRole role);
}
