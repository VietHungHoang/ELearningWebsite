package com.elearning.bffservice.service.impl;

import com.elearning.bffservice.client.ClassServiceClient;
import com.elearning.bffservice.client.StudentServiceClient;
import com.elearning.bffservice.client.TutorServiceClient;
import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.classes.response.BookedSessionResponse;
import com.elearning.bffservice.dto.tutor.response.UserInfoResponse;
import com.elearning.bffservice.dto.tutor.response.TutorResponse;
import com.elearning.bffservice.service.ClassService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassServiceImpl implements ClassService {

    private final ClassServiceClient classServiceClient;
    private final StudentServiceClient studentServiceClient;
    private final TutorServiceClient tutorServiceClient;
}
