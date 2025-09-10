package com.elearning.userservice.controller;

import com.elearning.userservice.dto.request.CreateUserRequest;
import com.elearning.userservice.dto.response.ApiResponse;
import com.elearning.userservice.dto.response.UserResponse;
import com.elearning.userservice.enums.UserRole;
import com.elearning.userservice.enums.UserStatus;
import com.elearning.userservice.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {
    
    private final IUserService userService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse user = userService.createUser(request);
        ApiResponse<UserResponse> response = ApiResponse.success(user, "User created successfully");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        ApiResponse<UserResponse> response = ApiResponse.success(user, "User retrieved successfully");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserByEmail(@PathVariable String email) {
        UserResponse user = userService.getUserByEmail(email);
        ApiResponse<UserResponse> response = ApiResponse.success(user, "User retrieved successfully");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        ApiResponse<List<UserResponse>> response = ApiResponse.success(users, "Retrieved all users");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByRole(@PathVariable UserRole role) {
        List<UserResponse> users = userService.getUsersByRole(role);
        ApiResponse<List<UserResponse>> response = ApiResponse.success(users, "Retrieved users by role: " + role);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id, 
            @Valid @RequestBody CreateUserRequest request) {
        UserResponse user = userService.updateUser(id, request);
        ApiResponse<UserResponse> response = ApiResponse.success(user, "User updated successfully");
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        ApiResponse<Void> response = ApiResponse.success(null, "User deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable Long id, 
            @RequestParam UserStatus status) {
        UserResponse user = userService.updateUserStatus(id, status);
        ApiResponse<UserResponse> response = ApiResponse.success(user, "User status updated successfully");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchUsers(@RequestParam String name) {
        List<UserResponse> users = userService.searchUsersByName(name);
        ApiResponse<List<UserResponse>> response = ApiResponse.success(users, "Search results for: " + name);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/count/{role}")
    public ResponseEntity<ApiResponse<Long>> countUsersByRole(@PathVariable UserRole role) {
        Long count = userService.countUsersByRole(role);
        ApiResponse<Long> response = ApiResponse.success(count, "Count for role " + role);
        return ResponseEntity.ok(response);
    }
}
