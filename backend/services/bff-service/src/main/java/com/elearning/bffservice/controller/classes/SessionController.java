package com.elearning.bffservice.controller.classes;

import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/bff/classes/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final ClassService classService;
}
