// AccountCreateRequest.java
package com.elearning.user_service.dto.request;

import com.elearning.user_service.model.Role;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountCreateRequest {
    private String email;
    private Role role;
    private ProfileRequest profile; // ⚡ thêm profile
}
