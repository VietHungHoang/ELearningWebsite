package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.event.AccountCreatedEvent;
import com.elearning.tutorservice.dto.event.TutorApprovedEvent;
import com.elearning.tutorservice.dto.event.TutorProfileUpdatedEvent;
import com.elearning.tutorservice.dto.event.TutorIndexEvent;
import com.elearning.tutorservice.dto.response.*;
import com.elearning.tutorservice.entity.*;
import com.elearning.tutorservice.service.producer.KafkaProducer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.elearning.tutorservice.dto.request.BulkUpdateAvailabilityRequest;
import com.elearning.tutorservice.dto.request.SubmitReviewRequest;
import com.elearning.tutorservice.dto.request.AvailabilityInput;
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
    private final TutorAvailabilityRepository availabilityRepository;
    private final TutorOnboardingRepository onboardingRepository;
    private final TutorSubjectRepository tutorSubjectRepository;
    private final TutorLanguageRepository tutorLanguageRepository;
    private final TutorSocialRepository tutorSocialRepository;
    private final CareerEntryRepository careerEntryRepository;
    private final CertificationRepository certificationRepository;
    private final TutorReviewRepository tutorReviewRepository;
    private final ObjectMapper objectMapper;
    private final KafkaProducer kafkaProducer;
    private final TutorIndexEventMapper tutorIndexEventMapper;
    private final TutorMapper tutorMapper;
    private final EntityManager entityManager;
    private final AvailabilityService availabilityService;
    
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    @Override
    @Transactional(readOnly = true)
    public TutorDetailResponse getTutorDetail(UUID tutorId) {
        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));

        return tutorMapper.toTutorDetailResponse(tutor);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<UUID, TutorResponse> getTutorsByIds(List<UUID> ids) {
        List<Tutor> tutors = tutorRepository.findAllById(ids);

        return tutors.stream()
                .collect(Collectors.toMap(Tutor::getId, tutorMapper::toTutorResponse));
    }

    @Override
    @Transactional
    public void updateOnboardingStatus(UUID tutorId, UpdateOnboardingStatusRequest request) {
        log.info("Updating onboarding status for tutor {} to {}", tutorId, request.getStatus());

        TutorOnboarding onboarding = onboardingRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Onboarding not found for tutor: " + tutorId));

        try {
            onboarding.setStatus(request.getStatus());
            onboarding.setDescription(request.getDescription());

            onboardingRepository.save(onboarding);

            log.info("Successfully updated onboarding status for tutor {} to {}", tutorId, request.getStatus());
        } catch (Exception e) {
            log.error("Failed to update onboarding status", e);
            throw new RuntimeException("Failed to update onboarding status", e);
        }
    }

    @Override
    @Transactional
    public void createTutorOnboarding(AccountCreatedEvent event) {
        log.info("Creating tutor onboarding for user: {} with role: {}", event.getId(), event.getRole());

        // Only create onboarding for tutors
        if (event.getRole() == null || !"TUTOR".equalsIgnoreCase(event.getRole().trim())) {
            log.info("Skipping onboarding creation for non-tutor user: {} (role: {})", event.getId(), event.getRole());
            return;
        }

        log.info("Proceeding with onboarding creation for tutor: {}", event.getId());

        try {
            // Create JSON data with id, name, email
            Map<String, Object> onboardingData = new HashMap<>();
            onboardingData.put("id", event.getId().toString());
            onboardingData.put("fullName", event.getFullName());
            onboardingData.put("email", event.getEmail());

            String jsonData = objectMapper.writeValueAsString(onboardingData);

            TutorOnboarding onboarding = TutorOnboarding.builder()
                    .tutorId(event.getId())
                    .jsonData(jsonData)
                    .build();

            onboardingRepository.save(onboarding);

            log.info("Successfully created tutor onboarding for user: {}", event.getId());
        } catch (Exception e) {
            log.error("Failed to create tutor onboarding", e);
            throw new RuntimeException("Failed to create tutor onboarding", e);
        }
    }

    @Override
    public void updateTutorProfile(TutorProfileUpdatedEvent event) {
        log.info("Updating tutor profile for: {}", event.getTutorId());

        try {
            // Get existing tutor
            Tutor tutor = tutorRepository.findById(event.getTutorId())
                    .orElseThrow(() -> new RuntimeException("Tutor not found: " + event.getTutorId()));

            // Update basic fields
            if (event.getFullName() != null) {
                tutor.setFullName(event.getFullName());
            }
            if (event.getHeadline() != null) {
                tutor.setHeadline(event.getHeadline());
            }
            if (event.getIntroduction() != null) {
                tutor.setIntroduction(event.getIntroduction());
            }

            // Save updated tutor
            tutorRepository.save(tutor);
            log.info("Updated tutor profile for: {}", event.getTutorId());

            // Publish update event to search service
            publishTutorUpdateEvent(tutor);

        } catch (Exception e) {
            log.error("Failed to update tutor profile for {}: {}", event.getTutorId(), e.getMessage(), e);
            throw new RuntimeException("Failed to update tutor profile", e);
        }
    }

    /**
     * Helper method to publish tutor index events
     */
    private void publishTutorUpdateEvent(Tutor tutor) {
        try {
            TutorIndexEvent indexEvent = tutorIndexEventMapper.toEvent(tutor, "UPDATED");
            kafkaProducer.sendTutorIndexEvent(indexEvent);
            log.info("Published tutor update event for: {}", tutor.getId());
        } catch (Exception e) {
            log.error("Failed to publish tutor update event for {}: {}", tutor.getId(), e.getMessage());
            // Don't fail the main operation if indexing fails
        }
    }
    
    @Override
    public AvailabilityListResponse getAvailabilities(UUID tutorId, LocalDate startDate, LocalDate endDate) {
        return availabilityService.getAvailabilities(tutorId, startDate, endDate);
    }

    @Override
    @Transactional
    public void approveTutor(UUID tutorId) {
        log.info("Approving tutor: {}", tutorId);

        TutorOnboarding onboarding = onboardingRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Onboarding not found for tutor: " + tutorId));

        try {
            // Parse onboarding data to TutorDetailResponse object
            log.info("JSON data: {}", onboarding.getJsonData());
            TutorDetailResponse tutorData = objectMapper.readValue(onboarding.getJsonData(), TutorDetailResponse.class);

            log.info("Parsed tutor data from onboarding for tutor: {}", tutorData);

            // 1. Save main Tutor entity (without child collections)
            Tutor tutor = Tutor.builder()
                    .id(tutorId)
                    .fullName(tutorData.getFullName())
                    .email(tutorData.getEmail())
                    .isVerified(true)
                    .introduction(tutorData.getIntroduction())
                    .headline(tutorData.getHeadline())
                    .countryCode(tutorData.getCountryCode())
                    .gender(tutorData.getGender())
                    .avatarUrl(tutorData.getAvatarUrl())
                    .timezone(tutorData.getTimezone())
                    .videoUrl(tutorData.getVideoUrl())
                    .currentSessionFee(tutorData.getCurrentSessionFee())
                    .build();
            
            tutorRepository.save(tutor);
            entityManager.flush();
            log.info("Created tutor record for: {}", tutorId);

            // 2. Save TutorLanguages (only if valid data exists)
            if (tutorData.getLanguageCodes() != null && !tutorData.getLanguageCodes().isEmpty()) {
                List<TutorLanguage> validLanguages = tutorData.getLanguageCodes().stream()
                        .filter(lang -> lang.getCode() != null) // Skip if code is null
                        .map(lang -> TutorLanguage.builder()
                                .tutor(tutor)
                                .code(lang.getCode())
                                .isNative(lang.getIsNative())
                                .build())
                        .toList();
                
                if (!validLanguages.isEmpty()) {
                    tutorLanguageRepository.saveAll(validLanguages);
                    log.info("Created {} language records", validLanguages.size());
                } else {
                    log.warn("No valid language data to insert for tutor: {}", tutorId);
                }
            }

            // 3. Save TutorSubjects (only if valid data exists)
            if (tutorData.getSubjectIds() != null && !tutorData.getSubjectIds().isEmpty()) {
                List<TutorSubject> validSubjects = tutorData.getSubjectIds().stream()
                        .map(subjectId -> TutorSubject.builder()
                                .tutor(tutor)
                                .categoryId(subjectId)
                                .subjectName("Subject") // TODO: Look up actual subject name
                                .build())
                        .toList();
                
                tutorSubjectRepository.saveAll(validSubjects);
                log.info("Created {} subject records", validSubjects.size());
            }

            // 4. Save TutorAvailabilities
            if (tutorData.getAvailabilities() != null && !tutorData.getAvailabilities().isEmpty()) {
                List<TutorAvailability> availabilities = tutorData.getAvailabilities().stream()
                        .map(avail -> TutorAvailability.builder()
                                .tutor(tutor)
                                .dayOfWeek(avail.getDayOfWeek().shortValue())
                                .startTime(LocalTime.parse(avail.getStartTime(), TIME_FORMATTER))
                                .endTime(LocalTime.parse(avail.getEndTime(), TIME_FORMATTER))
                                .effectiveStartDate(avail.getEffectiveStartDate())
                                .effectiveEndDate(avail.getEffectiveEndDate())
                                .build())
                        .toList();
                availabilityRepository.saveAll(availabilities);
                log.info("Created {} availability records", availabilities.size());
            }

            // 5. Save TutorSocialLinks
            if (tutorData.getSocialLinks() != null && !tutorData.getSocialLinks().isEmpty()) {
                List<TutorSocial> socialLinks = tutorData.getSocialLinks().stream()
                        .map(social -> TutorSocial.builder()
                                .tutor(tutor)
                                .platform(social.getPlatform())
                                .url(social.getUrl())
                                .build())
                        .toList();
                tutorSocialRepository.saveAll(socialLinks);
                log.info("Created {} social link records", socialLinks.size());
            }

            // 6. Save Educations
            if (tutorData.getEducations() != null && !tutorData.getEducations().isEmpty()) {
                List<CareerEntry> educations = tutorData.getEducations().stream()
                        .map(edu -> CareerEntry.builder()
                                .tutor(tutor)
                                .type("EDUCATION")
                                .title(edu.getTitle())
                                .institution(edu.getInstitution())
                                .startDate(edu.getStartDate())
                                .endDate(edu.getEndDate())
                                .location(edu.getLocation())
                                .description(edu.getDescription())
                                .build())
                        .toList();
                careerEntryRepository.saveAll(educations);
                log.info("Created {} education records", educations.size());
            }

            // 7. Save Experiences
            if (tutorData.getExperiences() != null && !tutorData.getExperiences().isEmpty()) {
                List<CareerEntry> experiences = tutorData.getExperiences().stream()
                        .map(exp -> CareerEntry.builder()
                                .tutor(tutor)
                                .type("EXPERIENCE")
                                .title(exp.getTitle())
                                .institution(exp.getInstitution())
                                .startDate(exp.getStartDate())
                                .endDate(exp.getEndDate())
                                .location(exp.getLocation())
                                .description(exp.getDescription())
                                .build())
                        .toList();
                careerEntryRepository.saveAll(experiences);
                log.info("Created {} experience records", experiences.size());
            }

            // 8. Save Certifications
            if (tutorData.getCertifications() != null && !tutorData.getCertifications().isEmpty()) {
                List<Certification> certifications = tutorData.getCertifications().stream()
                        .map(cert -> Certification.builder()
                                .tutor(tutor)
                                .name(cert.getName())
                                .issuingOrganization(cert.getIssuingOrganization())
                                .issueDate(cert.getIssueDate())
                                .expirationDate(cert.getExpirationDate())
                                .credentialId(cert.getCredentialId())
                                .credentialUrl(cert.getCredentialUrl())
                                .build())
                        .toList();
                certificationRepository.saveAll(certifications);
                log.info("Created {} certification records", certifications.size());
            }

            // Update onboarding status to APPROVED
            onboarding.setStatus(OnboardingStatus.APPROVED);
            onboardingRepository.save(onboarding);
            log.info("Updated onboarding status to APPROVED for: {}", tutorId);

            // Send notification event
            TutorApprovedEvent event = TutorApprovedEvent.builder()
                    .tutorId(tutorId)
                    .email(tutor.getEmail())
                    .fullName(tutor.getFullName())
                    .build();
            kafkaProducer.sendTutorApprovedEvent(event);
            log.info("Sent tutor approved notification for: {}", tutorId);

            // Publish tutor index event to search service
            try {
                TutorIndexEvent indexEvent = tutorIndexEventMapper.toEvent(tutor, "CREATED");
                kafkaProducer.sendTutorIndexEvent(indexEvent);
                log.info("Published tutor index event for new tutor: {}", tutorId);
            } catch (Exception e) {
                log.error("Failed to publish tutor index event for {}: {}", tutorId, e.getMessage());
                // Don't fail the approval process if indexing fails
            }

        } catch (Exception e) {
            log.error("Failed to approve tutor {}: {}", tutorId, e.getMessage(), e);
            throw new RuntimeException("Failed to approve tutor", e);
        }
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
