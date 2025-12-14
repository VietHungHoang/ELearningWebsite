package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.response.TutorResponse;
import com.elearning.tutorservice.entity.Tutor;
import com.elearning.tutorservice.mapper.TutorMapper;
import com.elearning.tutorservice.repository.TutorRepository;
import com.elearning.tutorservice.service.TutorSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TutorSearchServiceImpl implements TutorSearchService {

    private final TutorRepository tutorRepository;
    private final TutorMapper tutorMapper;

    @Override
    public List<TutorResponse> getTutorsByIds(List<UUID> tutorIds) {
        if (tutorIds == null || tutorIds.isEmpty()) {
            return List.of();
        }

        List<Tutor> tutors = tutorRepository.findAllById(tutorIds);

        return tutors.stream()
                .map(tutorMapper::toTutorResponse)
                .collect(Collectors.toList());
    }
}