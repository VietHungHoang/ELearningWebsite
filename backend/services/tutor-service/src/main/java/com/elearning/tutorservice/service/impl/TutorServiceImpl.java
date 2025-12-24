package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.event.AccountCreatedEvent;
import com.elearning.tutorservice.dto.event.TutorApprovedEvent;
import com.elearning.tutorservice.dto.event.TutorProfileUpdatedEvent;
import com.elearning.tutorservice.dto.event.TutorIndexEvent;
import com.elearning.tutorservice.dto.response.*;
import com.elearning.tutorservice.entity.*;
import com.elearning.tutorservice.service.producer.KafkaProducer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.elearning.tutorservice.dto.request.SubmitReviewRequest;
import com.elearning.tutorservice.dto.request.UpdateOnboardingStatusRequest;
import com.elearning.tutorservice.entity.enums.OnboardingStatus;
import com.elearning.tutorservice.repository.TutorAvailabilityRepository;
import com.elearning.tutorservice.repository.TutorOnboardingRepository;
import com.elearning.tutorservice.repository.TutorRepository;
import com.elearning.tutorservice.repository.TutorReviewRepository;
import com.elearning.tutorservice.repository.TutorSubjectRepository;
import com.elearning.tutorservice.repository.TutorLanguageRepository;
import com.elearning.tutorservice.repository.TutorSocialRepository;
import com.elearning.tutorservice.repository.CareerEntryRepository;
import com.elearning.tutorservice.repository.CertificationRepository;
import com.elearning.tutorservice.service.TutorService;
import com.elearning.tutorservice.service.AvailabilityService;
import com.elearning.tutorservice.mapper.TutorIndexEventMapper;
import com.elearning.tutorservice.mapper.TutorMapper;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TutorServiceImpl implements TutorService {

    private final TutorRepository tutorRepository;
    private final TutorReviewRepository tutorReviewRepository;
    private final TutorMapper tutorMapper;

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    @Override
    @Transactional(readOnly = true)
    public TutorResponse getTutorById(UUID tutorId) {
        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));

        return tutorMapper.toTutorResponse(tutor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TutorResponse> getTutorsByIds(List<UUID> ids) {
        List<Tutor> tutors = tutorRepository.findAllById(ids);

        return tutors.stream()
                .map(tutorMapper::toTutorResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void submitReview(UUID tutorId, SubmitReviewRequest request) {
        try {
            // Validate tutor exists
            Tutor tutor = tutorRepository.findById(tutorId)
                    .orElseThrow(() -> new RuntimeException("Tutor not found"));

            // Create and save the review
            TutorReview review = TutorReview.builder()
                    .tutor(tutor)
                    .studentId(request.getStudentId())
                    .rating(request.getRating())
                    .comment(request.getComment())
                    .build();

            tutorReviewRepository.save(review);
            log.info("Review submitted for tutor {} by student {}", tutorId, request.getStudentId());

        } catch (Exception e) {
            log.error("Failed to submit review for tutor {}: {}", tutorId, e.getMessage(), e);
            throw new RuntimeException("Failed to submit review", e);
        }
    }
}
