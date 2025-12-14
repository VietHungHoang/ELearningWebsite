package com.elearning.classservice.controller;

import com.elearning.classservice.dto.response.StartSessionResponse;
import com.elearning.classservice.entity.Session;
import com.elearning.classservice.service.SessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
@Slf4j
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/{sessionId}/start")
    public ResponseEntity<StartSessionResponse> startSession(
            @PathVariable UUID sessionId,
            @RequestParam UUID tutorId) {

        log.info("Request to start session {} by tutor {}", sessionId, tutorId);

        StartSessionResponse response = sessionService.startSession(sessionId, tutorId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<Session> getSession(@PathVariable UUID sessionId) {
        log.info("Request to get session {}", sessionId);

        Session session = sessionService.getSessionById(sessionId);

        return ResponseEntity.ok(session);
    }

}
