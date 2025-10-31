package com.elearning.authservice.dto.request;

import lombok.Data;

@Data
public class RegistrationStartRequest {
    private String fullname;
    private String email;
}