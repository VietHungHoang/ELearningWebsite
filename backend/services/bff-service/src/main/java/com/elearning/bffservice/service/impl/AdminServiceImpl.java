package com.elearning.bffservice.service.impl;

import com.elearning.bffservice.client.AuthServiceClient;
import com.elearning.bffservice.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final AuthServiceClient authServiceClient;

    @Override
    public void approveTutor(UUID tutorId) {
        log.info("Admin approving tutor: {}", tutorId);

        try {
            authServiceClient.assignTutorRole(tutorId.toString());
            log.info("Tutor approval initiated for: {}", tutorId);

        } catch (Exception e) {
            log.error("Failed to approve tutor {}: {}", tutorId, e.getMessage(), e);
            throw new RuntimeException("Failed to approve tutor: " + e.getMessage(), e);
        }
    }
}