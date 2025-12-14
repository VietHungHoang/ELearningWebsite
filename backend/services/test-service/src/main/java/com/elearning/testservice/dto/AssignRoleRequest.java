package com.elearning.testservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignRoleRequest {
    private String roleName;
    private List<UUID> userIds;
    private List<String> emails;
}