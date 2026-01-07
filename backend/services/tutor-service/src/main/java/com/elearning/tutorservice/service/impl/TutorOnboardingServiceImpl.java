package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.event.AccountCreatedEvent;
import com.elearning.tutorservice.dto.event.AvatarUpdateEvent;
import com.elearning.tutorservice.dto.event.RoleAssignRequestEvent;
import com.elearning.tutorservice.dto.event.TutorApprovedEvent;
import com.elearning.tutorservice.dto.event.TutorIndexEvent;
import com.elearning.tutorservice.dto.onboarding.TutorOnboardingDto;
import com.elearning.tutorservice.dto.request.UpdateOnboardingRequest;
import com.elearning.tutorservice.dto.response.OnboardingResponse;
import com.elearning.tutorservice.dto.response.PendingTutorResponse;
import com.elearning.tutorservice.dto.response.TutorResponse;
import com.elearning.tutorservice.entity.*;
import com.elearning.tutorservice.entity.enums.OnboardingStatus;
import com.elearning.tutorservice.mapper.TutorIndexEventMapper;
import com.elearning.tutorservice.mapper.TutorMapper;
import com.elearning.tutorservice.repository.*;
import com.elearning.tutorservice.service.AvailabilityService;
import com.elearning.tutorservice.service.GeminiService;
import com.elearning.tutorservice.service.TutorOnboardingService;
import com.elearning.tutorservice.service.producer.KafkaProducer;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
    private final GeminiService geminiService;
    private final TutorZoomCredentialRepository tutorZoomCredentialRepository;

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
    public void processResumeSubmission(UUID tutorId, String resumeText) {
        log.info("Processing resume submission for tutor: {}", tutorId);

        TutorOnboarding onboarding = onboardingRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Onboarding not found for tutor: " + tutorId));

        try {
            // Get existing JSON data (contains id, email, fullName)
            String existingJsonData = onboarding.getJsonData();

            // Call Gemini to parse resume and get structured JSON
            String parsedJson = geminiService.parseResumeToJson(resumeText, existingJsonData);

            // Update onboarding with parsed data
            onboarding.setJsonData(parsedJson);
            onboardingRepository.save(onboarding);

            log.info("Successfully processed resume submission for tutor: {}", tutorId);
        } catch (Exception e) {
            log.error("Failed to process resume submission for tutor: {}", tutorId, e);
            throw new RuntimeException("Failed to process resume submission: " + e.getMessage(), e);
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

            // Clone Zoom credentials from any existing tutor
            cloneZoomCredential(tutorId);

            onboarding.setStatus(OnboardingStatus.APPROVED);
            onboardingRepository.save(onboarding);
            log.info("Updated onboarding status to APPROVED for: {}", tutorId);

            // Send role assignment request to Auth Service via Kafka
            RoleAssignRequestEvent roleEvent = RoleAssignRequestEvent.builder()
                    .userId(tutorId)
                    .role("TUTOR")
                    .build();
            kafkaProducer.sendRoleAssignRequest(roleEvent);
            log.info("Sent role assignment request for tutor: {}", tutorId);

            // Send notification event
            TutorApprovedEvent event = TutorApprovedEvent.builder()
                    .tutorId(tutorId)
                    .email(tutor.getEmail())
                    .fullName(tutor.getFullName())
                    .build();
            kafkaProducer.sendTutorApprovedEvent(event);
            log.info("Sent tutor approved notification for: {}", tutorId);

            // Refresh tutor from DB to access lazy collections
            entityManager.flush();
            entityManager.clear();
            Tutor tutorWithRelationships = tutorRepository.findById(tutorId)
                    .orElseThrow(() -> new RuntimeException("Tutor not found after save: " + tutorId));

            // Access lazy collections (Hibernate will fetch them in current transaction)
            int subjectsCount = tutorWithRelationships.getSubjects() != null
                    ? tutorWithRelationships.getSubjects().size()
                    : 0;
            int languagesCount = tutorWithRelationships.getLanguages() != null
                    ? tutorWithRelationships.getLanguages().size()
                    : 0;
            int availabilitiesCount = tutorWithRelationships.getAvailabilities() != null
                    ? tutorWithRelationships.getAvailabilities().size()
                    : 0;

            log.info("Refreshed tutor with relationships - subjects: {}, languages: {}, availabilities: {}",
                    subjectsCount, languagesCount, availabilitiesCount);

            // Send to search service with full relationships
            TutorIndexEvent indexEvent = tutorIndexEventMapper.toEvent(tutorWithRelationships, "CREATED");
            kafkaProducer.sendTutorIndexEvent(indexEvent);
            log.info("Published tutor index event for new tutor: {}", tutorId);

            // Send tutor approved event for notifications and other services (quiz-service,
            // etc.)
            TutorApprovedEvent approvedEvent = TutorApprovedEvent.builder()
                    .tutorId(tutorId)
                    .fullName(tutor.getFullName())
                    .avatarUrl(tutor.getAvatarUrl())
                    .email(tutor.getEmail())
                    .build();
            kafkaProducer.sendTutorApprovedEvent(approvedEvent);
            log.info("Published tutor approved event for tutor: {}", tutorId);

            // Send avatar update event if avatarUrl exists
            if (tutor.getAvatarUrl() != null && !tutor.getAvatarUrl().isEmpty()) {
                AvatarUpdateEvent avatarEvent = AvatarUpdateEvent.builder()
                        .userId(tutorId)
                        .avatarUrl(tutor.getAvatarUrl())
                        .build();
                kafkaProducer.sendAvatarUpdateEvent(avatarEvent);
                log.info("Sent avatar update event for tutor: {}", tutorId);
            }

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
                            .subjectId(subjectId)
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

    /**
     * Clone Zoom credentials from an existing tutor to the newly approved tutor
     * Finds any tutor with non-null accessToken and creates a duplicate credential
     * 
     * @param newTutorId The ID of the newly approved tutor
     */
    private void cloneZoomCredential(UUID newTutorId) {
        try {
            // Find any existing Zoom credential with non-null accessToken
            Optional<TutorZoomCredential> existingCredential = tutorZoomCredentialRepository
                    .findFirstByAccessTokenIsNotNull();

            if (existingCredential.isPresent()) {
                TutorZoomCredential sourceCredential = existingCredential.get();

                // Create new credential with all data from source, only change tutorId
                TutorZoomCredential newCredential = TutorZoomCredential.builder()
                        .tutorId(newTutorId)
                        .accessToken(sourceCredential.getAccessToken())
                        .refreshToken(sourceCredential.getRefreshToken())
                        .expiresAt(sourceCredential.getExpiresAt())
                        .zoomUserId(sourceCredential.getZoomUserId())
                        .zoomEmail(sourceCredential.getZoomEmail())
                        .build();

                tutorZoomCredentialRepository.save(newCredential);
                log.info("Successfully cloned Zoom credentials for new tutor: {} from tutor: {}",
                        newTutorId, sourceCredential.getTutorId());
            } else {
                log.warn("No existing Zoom credentials found with non-null accessToken. " +
                        "Skipping Zoom credential cloning for tutor: {}", newTutorId);
            }
        } catch (Exception e) {
            // Don't fail the entire approval process if Zoom credential cloning fails
            log.error("Failed to clone Zoom credentials for tutor: {}. Error: {}",
                    newTutorId, e.getMessage(), e);
        }
    }

    @Override
    public String generateIntroduction(UUID tutorId, String prompt) {
        log.info("Generating introduction for tutor: {} with prompt: {}", tutorId, prompt);

        // Get tutor onboarding data
        TutorOnboarding onboarding = onboardingRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Onboarding not found for tutor: " + tutorId));

        String jsonData = onboarding.getJsonData();
        if (jsonData == null || jsonData.isEmpty()) {
            throw new RuntimeException("No onboarding data found for tutor: " + tutorId);
        }

        // Build prompt for Gemini
        String fullPrompt = buildIntroductionPrompt(prompt, jsonData);

        // Call Gemini API
        String generatedIntroduction = callGeminiForIntroduction(fullPrompt);

        log.info("Successfully generated introduction for tutor: {}", tutorId);
        return generatedIntroduction;
    }

    private String buildIntroductionPrompt(String userPrompt, String jsonData) {
        return """
                You are a professional writer helping tutors create compelling introductions for their profiles.

                Based on the following tutor information and user request, generate a professional introduction:

                Tutor Information (JSON):
                %s

                User Request:
                %s

                Instructions:
                1. Write a professional, engaging introduction in the first person
                2. Highlight the tutor's experience, qualifications, and teaching style
                3. Keep it concise (2-3 paragraphs, around 150-250 words)
                4. Make it warm and approachable while maintaining professionalism
                5. Focus on what makes this tutor unique and valuable to students
                6. Only return the introduction text, no additional formatting or explanations

                Generate the introduction now:
                """.formatted(jsonData, userPrompt);
    }

    private String callGeminiForIntroduction(String prompt) {
        try {
            String response = geminiService.callGeminiApi(prompt);
            return extractTextFromGeminiResponse(response);
        } catch (Exception e) {
            log.error("Failed to generate introduction with Gemini", e);
            throw new RuntimeException("Failed to generate introduction", e);
        }
    }

    private String extractTextFromGeminiResponse(String response) {
        try {
            com.fasterxml.jackson.databind.JsonNode rootNode = objectMapper.readTree(response);
            com.fasterxml.jackson.databind.JsonNode candidates = rootNode.get("candidates");

            if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                com.fasterxml.jackson.databind.JsonNode firstCandidate = candidates.get(0);
                com.fasterxml.jackson.databind.JsonNode content = firstCandidate.get("content");

                if (content != null) {
                    com.fasterxml.jackson.databind.JsonNode parts = content.get("parts");

                    if (parts != null && parts.isArray() && parts.size() > 0) {
                        com.fasterxml.jackson.databind.JsonNode text = parts.get(0).get("text");
                        if (text != null) {
                            return text.asText().trim();
                        }
                    }
                }
            }

            throw new RuntimeException("Could not extract text from Gemini response");
        } catch (Exception e) {
            log.error("Failed to parse Gemini response", e);
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }

    @Override
    public Page<PendingTutorResponse> getPendingRequests(int page, int size) {
        log.info("Getting pending tutor requests, page: {}, size: {}", page, size);

        // Convert to 0-based index if needed
        int pageIndex = page > 0 ? page - 1 : 0;

        Pageable pageable = PageRequest.of(pageIndex, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<TutorOnboarding> onboardingPage = onboardingRepository.findByStatus(OnboardingStatus.PENDING, pageable);

        return onboardingPage.map(onboarding -> {
            // Parse jsonData to get email, avatarUrl, and subjectIds
            String email = null;
            String avatarUrl = null;
            List<UUID> subjectIds = null;
            String fullName = null;

            try {
                if (onboarding.getJsonData() != null) {
                    TutorOnboardingDto data = objectMapper.readValue(onboarding.getJsonData(),
                            TutorOnboardingDto.class);
                    email = data.getEmail();
                    avatarUrl = data.getAvatarUrl();
                    subjectIds = data.getSubjectIds();
                    fullName = data.getFullName();
                }
            } catch (Exception e) {
                log.warn("Failed to parse jsonData for tutor: {}", onboarding.getTutorId(), e);
            }

            return PendingTutorResponse.builder()
                    .tutorId(onboarding.getTutorId())
                    .email(email)
                    .fullName(fullName)
                    .avatarUrl(avatarUrl)
                    .subjectIds(subjectIds)
                    .currentStep(onboarding.getCurrentStep())
                    .status(onboarding.getStatus())
                    .description(onboarding.getDescription())
                    .createdAt(onboarding.getCreatedAt())
                    .updatedAt(onboarding.getUpdatedAt())
                    .build();
        });
    }

    private String extractFullName(String jsonData) {
        try {
            TutorOnboardingDto data = objectMapper.readValue(jsonData, TutorOnboardingDto.class);
            return data.getFullName();
        } catch (Exception e) {
            return null;
        }
    }
}
