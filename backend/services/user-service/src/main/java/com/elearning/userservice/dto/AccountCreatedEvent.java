package com.elearning.userservice.dto;

import com.elearning.userservice.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountCreatedEvent {
    private String id;
    private String email;
    private String fullname;
    private Role role;
}
