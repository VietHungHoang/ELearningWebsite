package com.elearning.authservice.dto.request;

import com.elearning.authservice.entity.Role;

import lombok.Data;

@Data
public class SetPasswordRequest {
    private String email;
    private String password;
    private Role role;

}