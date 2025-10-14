package com.elearning.user_service.dto.response;

import com.elearning.user_service.model.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountResponse {
    private Long id;
    private String email;
    private Role role;
}
