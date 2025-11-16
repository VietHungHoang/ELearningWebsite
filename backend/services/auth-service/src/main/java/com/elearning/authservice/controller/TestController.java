package com.elearning.authservice.controller;

import com.elearning.authservice.dto.request.RegistrationStartRequest;
import com.elearning.authservice.dto.response.ApiResponse;
import com.elearning.authservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auth/test")
@RequiredArgsConstructor
public class TestController {

    private final AuthService authService;

    @PostMapping("/bulk-create")
    public ResponseEntity<ApiResponse<Void>> bulkCreateAccounts(@RequestBody List<RegistrationStartRequest> requests) {
        authService.bulkCreateAccounts(requests);
        return ResponseEntity.ok(ApiResponse.success("Bulk accounts created successfully", null));
    }
}