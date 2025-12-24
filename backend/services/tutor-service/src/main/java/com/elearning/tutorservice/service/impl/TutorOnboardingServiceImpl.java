package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.event.AccountCreatedEvent;
import com.elearning.tutorservice.dto.event.TutorApprovedEvent;
import com.elearning.tutorservice.dto.event.TutorIndexEvent;
import com.elearning.tutorservice.dto.onboarding.TutorOnboardingDto;
import com.elearning.tutorservice.dto.request.UpdateOnboardingRequest;
import com.elearning.tutorservice.dto.response.OnboardingResponse;
import com.elearning.tutorservice.dto.response.TutorResponse;
import com.elearning.tutorservice.entity.*;
import com.elearning.tutorservice.entity.enums.OnboardingStatus;
import com.elearning.tutorservice.mapper.TutorIndexEventMapper;
import com.elearning.tutorservice.mapper.TutorMapper;
import com.elearning.tutorservice.repository.*;
import com.elearning.tutorservice.service.AvailabilityService;
import com.elearning.tutorservice.service.TutorOnboardingService;
import com.elearning.tutorservice.service.producer.KafkaProducer;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TutorOnboardingServiceImpl implements TutorOnboardingService {

    private final TutorOnboardingRepository onboardingRepository;
    private final TutorMapper tutorMapper;
    private final KafkaProducer kafkaProducer;
    private final TutorIndexEventMapper tutorIndexEventMapper;
    private final ObjectMapper objectMapper;
    private final TutorRepository tutorRepository;
    private final TutorLanguageRepository tutorLanguageRepository;
    private final TutorSubjectRepository tutorSubjectRepository;
    private final CareerEntryRepository careerEntryRepository;
    private final TutorAvailabilityRepository availabilityRepository;
    private final TutorSocialRepository tutorSocialRepository;
    private final CertificationRepository certificationRepository;

    private final EntityManager entityManager;

    @Override
    public OnboardingResponse getOnboarding(UUID tutorId) {
        TutorOnboarding onboarding = onboardingRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Onboarding not found for tutor: " + tutorId));

        return tutorMapper.toOnboardingResponse(onboarding);
    }

    @Override
    @Transactional
    public void updateOnboarding(UUID tutorId, UpdateOnboardingRequest request) {
        int step = request.getStep();
        log.info("Updating onboarding for tutor {} step {}", tutorId, step);

        TutorOnboarding onboarding = onboardingRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Onboarding not found for tutor: " + tutorId));

        try {
            onboarding.setJsonData(request.getData());
            onboarding.setCurrentStep(Math.max(onboarding.getCurrentStep(), step));

            onboardingRepository.save(onboarding);

            log.info("Successfully updated onboarding for tutor {} step {}", tutorId, step);
        } catch (Exception e) {
            log.error("Failed to update onboarding data", e);
            throw new RuntimeException("Failed to update onboarding data", e);
        }
    }

    @Override
    @Transactional
    public void createTutorOnboarding(AccountCreatedEvent event) {
        log.info("Creating tutor onboarding for user: {} with role: {}", event.getId(), event.getRole());

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
    @Transactional
    public void approveTutor(UUID tutorId) {
        log.info("Approving tutor: {}", tutorId);

        TutorOnboarding onboarding = onboardingRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Onboarding not found for tutor: " + tutorId));

        try {
            // Parse onboarding data to TutorDetailResponse object
            log.info("JSON data: {}", onboarding.getJsonData());
            TutorOnboardingDto tutorData = objectMapper.readValue(onboarding.getJsonData(), TutorOnboardingDto.class);
            log.info("Parsed tutor data from onboarding for tutor: {}", tutorData);

            Tutor tutor = saveTutorEntity(tutorId, tutorData);
            saveTutorLanguage(tutorData, tutor);
            saveTutorSubjects(tutorData, tutor);
            saveTutorAvailabilities(tutorData, tutor);
            saveTutorSocialLinks(tutorData, tutor);
            saveEducations(tutorData, tutor);
            saveExperiences(tutorData, tutor);
            saveCertifications(tutorData, tutor);

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

            // Send to search service
            TutorIndexEvent indexEvent = tutorIndexEventMapper.toEvent(tutor, "CREATED");
            kafkaProducer.sendTutorIndexEvent(indexEvent);
            log.info("Published tutor index event for new tutor: {}", tutorId);

        } catch (Exception e) {
            log.error("Failed to approve tutor {}: {}", tutorId, e.getMessage(), e);
            throw new RuntimeException("Failed to approve tutor", e);
        }
    }

    private void saveCertifications(TutorOnboardingDto tutorData, Tutor tutor) {
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
    }

    private void saveExperiences(TutorOnboardingDto tutorData, Tutor tutor) {
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
    }

    private void saveEducations(TutorOnboardingDto tutorData, Tutor tutor) {
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
    }

    private void saveTutorSocialLinks(TutorOnboardingDto tutorData, Tutor tutor) {
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
    }

    private void saveTutorAvailabilities(TutorOnboardingDto tutorData, Tutor tutor) {
        if (tutorData.getAvailabilities() != null && !tutorData.getAvailabilities().isEmpty()) {
            List<TutorAvailability> availabilities = tutorData.getAvailabilities().stream()
                    .map(avail -> TutorAvailability.builder()
                            .tutor(tutor)
                            .dayOfWeek(avail.getDayOfWeek().shortValue())
                            .startTime(LocalTime.parse(avail.getStartTime()))
                            .endTime(LocalTime.parse(avail.getEndTime()))
                            .effectiveStartDate(avail.getEffectiveStartDate())
                            .effectiveEndDate(avail.getEffectiveEndDate())
                            .build())
                    .toList();
            availabilityRepository.saveAll(availabilities);
            log.info("Created {} availability records", availabilities.size());
        }
    }

    private void saveTutorSubjects(TutorOnboardingDto tutorData, Tutor tutor) {
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
    }

    private Tutor saveTutorEntity(UUID tutorId, TutorOnboardingDto tutorData) {
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
        return tutor;
    }

    private void saveTutorLanguage(TutorOnboardingDto tutorData, Tutor tutor) {
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
                log.warn("No valid language data to insert for tutor: {}", tutor.getId());
            }
        }
    }
}
