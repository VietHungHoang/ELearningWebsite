package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.response.UserInfoResponse;
import com.elearning.tutorservice.entity.Tutor;
import com.elearning.tutorservice.mapper.TutorMapper;
import com.elearning.tutorservice.repository.TutorRepository;
import com.elearning.tutorservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final TutorRepository tutorRepository;
    private final TutorMapper tutorMapper;

    @Override
    public List<UserInfoResponse> getUsersByIds(List<UUID> userIds) {
        List<Tutor> tutors = tutorRepository.findAllById(userIds);
        return tutors.stream()
                .map(tutorMapper::toUserInfoResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserInfoResponse getUserById(UUID userId) {
        return tutorRepository.findById(userId)
                .map(tutorMapper::toUserInfoResponse)
                .orElse(null);
    }
}
