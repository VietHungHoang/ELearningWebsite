package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.request.UpdateOnboardingRequest;
import com.elearning.tutorservice.dto.response.OnboardingResponse;
import com.elearning.tutorservice.entity.TutorOnboarding;
import com.elearning.tutorservice.mapper.TutorMapper;
import com.elearning.tutorservice.repository.TutorOnboardingRepository;
import com.elearning.tutorservice.service.TutorOnboardingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TutorOnboardingServiceImpl implements TutorOnboardingService {

    private final TutorOnboardingRepository onboardingRepository;
    private final TutorMapper tutorMapper;

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
}
