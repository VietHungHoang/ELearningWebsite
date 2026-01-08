package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.event.AccountCreatedEvent;
import com.elearning.tutorservice.dto.event.TutorApprovedEvent;
import com.elearning.tutorservice.dto.event.TutorProfileUpdatedEvent;
import com.elearning.tutorservice.dto.event.TutorIndexEvent;
import com.elearning.tutorservice.dto.response.*;
import com.elearning.tutorservice.entity.*;
import com.elearning.tutorservice.entity.enums.Gender;
import com.elearning.tutorservice.service.producer.KafkaProducer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.elearning.tutorservice.dto.request.SubmitReviewRequest;
import com.elearning.tutorservice.dto.request.UpdateOnboardingStatusRequest;
import com.elearning.tutorservice.dto.request.UpdateTutorProfileRequest;
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
import com.elearning.tutorservice.repository.TutorZoomCredentialRepository;
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
import java.util.ArrayList;
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
    private final TutorZoomCredentialRepository tutorZoomCredentialRepository;
    private final TutorLanguageRepository tutorLanguageRepository;
    private final TutorSocialRepository tutorSocialRepository;
    private final TutorSubjectRepository tutorSubjectRepository;

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    @Override
    @Transactional(readOnly = true)
    public TutorResponse getTutorById(UUID tutorId) {
        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));

        TutorResponse response = tutorMapper.toTutorResponse(tutor);
        
        // Set additional fields not in mapper
        response.setZoomConnected(tutorZoomCredentialRepository.existsByTutorId(tutorId));
        response.setTimezone(tutor.getTimezone());
        
        return response;
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

    @Override
    @Transactional
    public TutorResponse updateTutorProfile(UUID tutorId, UpdateTutorProfileRequest request) {
        log.info("Updating profile for tutor: {}", tutorId);
        
        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));

        // Update basic fields (only if not null)
        if (request.getFullName() != null) {
            tutor.setFullName(request.getFullName());
        }
        if (request.getGender() != null) {
            try {
                tutor.setGender(Gender.valueOf(request.getGender().toUpperCase()));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid gender value: {}", request.getGender());
            }
        }
        if (request.getHeadline() != null) {
            tutor.setHeadline(request.getHeadline());
        }
        if (request.getIntroduction() != null) {
            tutor.setIntroduction(request.getIntroduction());
        }
        if (request.getCountryCode() != null) {
            tutor.setCountryCode(request.getCountryCode());
        }
        if (request.getTimezone() != null) {
            tutor.setTimezone(request.getTimezone());
        }
        if (request.getVideoUrl() != null) {
            tutor.setVideoUrl(request.getVideoUrl());
        }
        if (request.getCurrentSessionFee() != null) {
            tutor.setCurrentSessionFee(request.getCurrentSessionFee());
        }

        // Update languages if provided
        if (request.getLanguages() != null) {
            // Delete existing languages
            tutorLanguageRepository.deleteByTutorId(tutorId);
            
            // Add new languages
            List<TutorLanguage> newLanguages = new ArrayList<>();
            for (UpdateTutorProfileRequest.LanguageInput langInput : request.getLanguages()) {
                TutorLanguage language = TutorLanguage.builder()
                        .tutor(tutor)
                        .code(langInput.getCode())
                        .isNative(langInput.getIsNative() != null ? langInput.getIsNative() : false)
                        .build();
                newLanguages.add(language);
            }
            tutorLanguageRepository.saveAll(newLanguages);
        }

        // Update social links if provided
        if (request.getSocialLinks() != null) {
            // Delete existing social links
            tutorSocialRepository.deleteByTutorId(tutorId);
            
            // Add new social links
            List<TutorSocial> newSocialLinks = new ArrayList<>();
            for (UpdateTutorProfileRequest.SocialLinkInput socialInput : request.getSocialLinks()) {
                TutorSocial social = TutorSocial.builder()
                        .tutor(tutor)
                        .platform(socialInput.getPlatform())
                        .url(socialInput.getUrl())
                        .build();
                newSocialLinks.add(social);
            }
            tutorSocialRepository.saveAll(newSocialLinks);
        }

        // Update subjects if provided
        if (request.getSubjectIds() != null) {
            // Delete existing subjects
            tutorSubjectRepository.deleteByTutorId(tutorId);
            
            // Add new subjects
            List<TutorSubject> newSubjects = new ArrayList<>();
            for (UUID subjectId : request.getSubjectIds()) {
                TutorSubject subject = TutorSubject.builder()
                        .tutor(tutor)
                        .subjectId(subjectId)
                        .build();
                newSubjects.add(subject);
            }
            tutorSubjectRepository.saveAll(newSubjects);
        }

        // Save tutor
        tutor = tutorRepository.save(tutor);
        log.info("Profile updated successfully for tutor: {}", tutorId);

        // Return updated profile
        return getTutorById(tutorId);
    }

    @Override
    @Transactional
    public void incrementTotalStudents(String tutorIdStr) {
        try {
            UUID tutorId = UUID.fromString(tutorIdStr);
            Tutor tutor = tutorRepository.findById(tutorId)
                    .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + tutorId));
            
            Integer currentCount = tutor.getTotalStudents();
            if (currentCount == null) {
                currentCount = 0;
            }
            tutor.setTotalStudents(currentCount + 1);
            tutorRepository.save(tutor);
            
            log.info("Successfully incremented totalStudents for tutor {} from {} to {}", 
                    tutorId, currentCount, currentCount + 1);
        } catch (IllegalArgumentException e) {
            log.error("Invalid tutor ID format: {}", tutorIdStr, e);
            throw new RuntimeException("Invalid tutor ID format", e);
        } catch (Exception e) {
            log.error("Failed to increment totalStudents for tutor {}: {}", tutorIdStr, e.getMessage(), e);
            throw new RuntimeException("Failed to increment totalStudents", e);
        }
    }
}
