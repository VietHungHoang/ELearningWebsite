package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.event.TutorProfileUpdatedEvent;
import com.elearning.tutorservice.dto.request.AvailabilityInput;
import com.elearning.tutorservice.dto.request.BulkUpdateAvailabilityRequest;
import com.elearning.tutorservice.dto.response.AvailabilityResponse;
import com.elearning.tutorservice.dto.response.TutorProfileResponse;
import com.elearning.tutorservice.dto.response.TutorScheduleResponse;
import com.elearning.tutorservice.dto.response.TutorSearchResponse;
import com.elearning.tutorservice.entity.AvailabilityStatus;
import com.elearning.tutorservice.entity.Tutor;
import com.elearning.tutorservice.entity.TutorAvailability;
import com.elearning.tutorservice.repository.TutorAvailabilityRepository;
import com.elearning.tutorservice.repository.TutorRepository;
import com.elearning.tutorservice.service.TutorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TutorServiceImpl implements TutorService {

    private final TutorRepository tutorRepository;
    private final TutorAvailabilityRepository availabilityRepository;
    
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    @Override
    public Page<TutorSearchResponse> searchTutors(List<String> languageCodes, BigDecimal minPrice, BigDecimal maxPrice, List<String> availableDays, Pageable pageable) {
        Page<Tutor> tutors = tutorRepository.findTutorsWithFilters(languageCodes, minPrice, maxPrice, pageable);

        return tutors.map(this::mapToSearchResponse);
    }

    @Override
    public List<TutorScheduleResponse> getTutorSchedule(Long tutorId, boolean includeBooked) {
        // TODO: Implement schedule logic
        return List.of();
    }

    @Override
    public TutorProfileResponse getTutorProfile(UUID tutorId) {
        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));

        return mapToProfileResponse(tutor);
    }

    private TutorSearchResponse mapToSearchResponse(Tutor tutor) {
        // TODO: Implement mapping
        return TutorSearchResponse.builder()
                .id(tutor.getId())
                .build();
    }

    private TutorProfileResponse mapToProfileResponse(Tutor tutor) {
        return TutorProfileResponse.builder()
                .id(tutor.getId())
                .isVerified(tutor.getIsVerified())
                .introduction(tutor.getIntroduction())
                .specialization(tutor.getSpecialization())
                .nationalityCode(tutor.getNationalityCode())
                .videoUrl(tutor.getVideoUrl())
                .videoThumbnailUrl(tutor.getVideoThumbnailUrl())
                .currentSessionFee(tutor.getCurrentSessionFee())
                .previousSessionFee(tutor.getPreviousSessionFee())
                .sessionDurationMinutes(tutor.getSessionDurationMinutes())
                .currency(tutor.getCurrency())
                .teachesInGroups(tutor.getTeachesInGroups())
                .maxGroupMembers(tutor.getMaxGroupMembers())
                .timezoneOffset(tutor.getTimezoneOffset())
                .languages(tutor.getLanguages() != null ? tutor.getLanguages().stream()
                        .map(lang -> TutorProfileResponse.TutorLanguageResponse.builder()
                                .id(lang.getId())
                                .languageCode(lang.getLanguageCode())
                                .proficiencyLevel(lang.getProficiencyLevel())
                                .build())
                        .collect(Collectors.toList()) : null)
                .socialLinks(tutor.getSocialLinks() != null ? tutor.getSocialLinks().stream()
                        .map(social -> TutorProfileResponse.TutorSocialResponse.builder()
                                .id(social.getId())
                                .platform(social.getPlatform())
                                .url(social.getUrl())
                                .build())
                        .collect(Collectors.toList()) : null)
                .subjects(tutor.getSubjects() != null ? tutor.getSubjects().stream()
                        .map(subject -> TutorProfileResponse.TutorSubjectResponse.builder()
                                .id(subject.getId())
                                .subjectId(null) // Not stored in tutor-service
                                .subjectName(subject.getSubjectName())
                                .categoryId(subject.getCategoryId())
                                .categoryName(null) // Not stored in tutor-service
                                .build())
                        .collect(Collectors.toList()) : null)
                .careerEntries(tutor.getCareerEntries() != null ? tutor.getCareerEntries().stream()
                        .map(entry -> TutorProfileResponse.CareerEntryResponse.builder()
                                .id(entry.getId())
                                .type(entry.getType())
                                .title(entry.getTitle())
                                .institution(entry.getInstitution())
                                .startDate(entry.getStartDate())
                                .endDate(entry.getEndDate())
                                .location(entry.getLocation())
                                .description(entry.getDescription())
                                .build())
                        .collect(Collectors.toList()) : null)
                .certifications(tutor.getCertifications() != null ? tutor.getCertifications().stream()
                        .map(cert -> TutorProfileResponse.CertificationResponse.builder()
                                .id(cert.getId())
                                .name(cert.getName())
                                .issuingOrganization(cert.getIssuingOrganization())
                                .issueDate(cert.getIssueDate())
                                .expirationDate(cert.getExpirationDate())
                                .credentialId(cert.getCredentialId())
                                .credentialUrl(cert.getCredentialUrl())
                                .build())
                        .collect(Collectors.toList()) : null)
                .build();
    }

    @Override
    public void updateTutorProfile(TutorProfileUpdatedEvent event) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateTutorProfile'");
    }
    
    @Override
    public List<AvailabilityResponse> getAvailabilities(UUID tutorId, LocalDate startDate, LocalDate endDate) {
        log.info("Getting availabilities for tutor {} from {} to {}", tutorId, startDate, endDate);
        
        List<TutorAvailability> availabilities = availabilityRepository.findByTutorIdAndDateRangeAndStatus(
                tutorId, startDate, endDate, AvailabilityStatus.AVAILABLE);
        
        return availabilities.stream()
                .map(this::mapToAvailabilityResponse)
                .collect(Collectors.toList());
    }
    
    private AvailabilityResponse mapToAvailabilityResponse(TutorAvailability availability) {
        return AvailabilityResponse.builder()
                .id(availability.getId())
                .dayOfWeek(availability.getDayOfWeek().intValue())
                .startTime(availability.getStartTime().format(TIME_FORMATTER))
                .endTime(availability.getEndTime().format(TIME_FORMATTER))
                .effectiveStartDate(availability.getEffectiveStartDate())
                .effectiveEndDate(availability.getEffectiveEndDate())
                .status(availability.getStatus())
                .build();
    }
    
    @Override
    @Transactional
    public void bulkUpdateAvailability(UUID tutorId, BulkUpdateAvailabilityRequest request) {
        log.info("Bulk updating availability for tutor {} with mode: {}", tutorId, request.getMode());
        
        // 1. Validate request
        validateBulkUpdateRequest(request);
        
        // 2. Get tutor
        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new IllegalArgumentException("Tutor not found with id: " + tutorId));
        
        // 3. Process based on mode
        if ("this_period".equals(request.getMode())) {
            handleThisPeriodMode(tutor, request);
        } else if ("recurring".equals(request.getMode())) {
            handleRecurringMode(tutor, request);
        } else {
            throw new IllegalArgumentException("Invalid mode: " + request.getMode() + ". Must be 'this_period' or 'recurring'");
        }
        
        log.info("Successfully bulk updated availability for tutor {}", tutorId);
    }
    
    /**
     * Validate bulk update request
     */
    private void validateBulkUpdateRequest(BulkUpdateAvailabilityRequest request) {
        // Validate mode
        if (!"this_period".equals(request.getMode()) && !"recurring".equals(request.getMode())) {
            throw new IllegalArgumentException("Mode must be 'this_period' or 'recurring'");
        }
        
        // Validate dates for "this_period" mode
        if ("this_period".equals(request.getMode())) {
            if (request.getStartDate() == null || request.getEndDate() == null) {
                throw new IllegalArgumentException("startDate and endDate are required for 'this_period' mode");
            }
            if (request.getStartDate().isAfter(request.getEndDate())) {
                throw new IllegalArgumentException("startDate must be before or equal to endDate");
            }
        }
        
        // Validate new availabilities
        if (request.getNewAvailabilities() != null) {
            for (AvailabilityInput input : request.getNewAvailabilities()) {
                LocalTime start = LocalTime.parse(input.getStartTime(), TIME_FORMATTER);
                LocalTime end = LocalTime.parse(input.getEndTime(), TIME_FORMATTER);
                if (start.isAfter(end) || start.equals(end)) {
                    throw new IllegalArgumentException("startTime must be before endTime");
                }
                if (input.getEffectiveEndDate() != null && 
                    input.getEffectiveStartDate().isAfter(input.getEffectiveEndDate())) {
                    throw new IllegalArgumentException("effectiveStartDate must be before or equal to effectiveEndDate");
                }
            }
        }
    }
    
    /**
     * Handle "this_period" mode - chỉ ảnh hưởng khoảng thời gian cụ thể
     * 
     * Logic:
     * 1. Với mỗi old availability:
     *    - Nếu nằm hoàn toàn trong period: DELETE
     *    - Nếu overlap với period: SPLIT thành các phần trước/sau period
     * 2. Tạo new availabilities với effectiveStartDate/endDate trong period
     */
    private void handleThisPeriodMode(Tutor tutor, BulkUpdateAvailabilityRequest request) {
        LocalDate periodStart = request.getStartDate();
        LocalDate periodEnd = request.getEndDate();
        
        log.info("Handling 'this_period' mode for period {} to {}", periodStart, periodEnd);
        
        // 1. Process old availabilities
        if (request.getOldAvailabilityIds() != null && !request.getOldAvailabilityIds().isEmpty()) {
            // Security check: Ensure all IDs belong to this tutor
            List<TutorAvailability> oldAvailabilities = availabilityRepository
                    .findByIdInAndTutorId(request.getOldAvailabilityIds(), tutor.getId());
            
            if (oldAvailabilities.size() != request.getOldAvailabilityIds().size()) {
                throw new IllegalArgumentException("Some availability IDs do not belong to this tutor");
            }
            
            List<TutorAvailability> toSave = new ArrayList<>();
            List<TutorAvailability> toDelete = new ArrayList<>();
            
            for (TutorAvailability old : oldAvailabilities) {
                LocalDate oldStart = old.getEffectiveStartDate();
                LocalDate oldEnd = old.getEffectiveEndDate(); // có thể null
                
                // Case 1: Old availability nằm hoàn toàn TRƯỚC period
                // -> Giữ nguyên, không làm gì
                if (oldEnd != null && oldEnd.isBefore(periodStart)) {
                    log.debug("Availability {} is completely before period, keeping it", old.getId());
                    continue;
                }
                
                // Case 2: Old availability bắt đầu SAU period
                // -> Giữ nguyên, không làm gì
                if (oldStart.isAfter(periodEnd)) {
                    log.debug("Availability {} starts after period, keeping it", old.getId());
                    continue;
                }
                
                // Case 3: Old availability overlap với period -> Cần split
                
                // Part 1: Phần TRƯỚC period (nếu có)
                if (oldStart.isBefore(periodStart)) {
                    TutorAvailability beforePart = TutorAvailability.builder()
                            .tutor(tutor)
                            .dayOfWeek(old.getDayOfWeek())
                            .startTime(old.getStartTime())
                            .endTime(old.getEndTime())
                            .effectiveStartDate(oldStart)
                            .effectiveEndDate(periodStart.minusDays(1)) // Kết thúc ngày trước period
                            .status(AvailabilityStatus.AVAILABLE)
                            .build();
                    toSave.add(beforePart);
                    log.debug("Created before-period part for availability {}", old.getId());
                }
                
                // Part 2: Phần SAU period (nếu có)
                // Chỉ tạo nếu old availability có endDate null (vô hạn) hoặc endDate sau period
                if (oldEnd == null || oldEnd.isAfter(periodEnd)) {
                    TutorAvailability afterPart = TutorAvailability.builder()
                            .tutor(tutor)
                            .dayOfWeek(old.getDayOfWeek())
                            .startTime(old.getStartTime())
                            .endTime(old.getEndTime())
                            .effectiveStartDate(periodEnd.plusDays(1)) // Bắt đầu ngày sau period
                            .effectiveEndDate(oldEnd) // Giữ nguyên endDate cũ (có thể null)
                            .status(AvailabilityStatus.AVAILABLE)
                            .build();
                    toSave.add(afterPart);
                    log.debug("Created after-period part for availability {}", old.getId());
                }
                
                // Xóa availability gốc (vì đã split thành trước/sau hoặc nằm trong period)
                toDelete.add(old);
            }
            
            // Save splits và delete olds
            if (!toSave.isEmpty()) {
                availabilityRepository.saveAll(toSave);
                log.info("Saved {} split availability parts", toSave.size());
            }
            if (!toDelete.isEmpty()) {
                availabilityRepository.deleteAll(toDelete);
                log.info("Deleted {} old availabilities", toDelete.size());
            }
        }
        
        // 2. Create new availabilities
        createNewAvailabilities(tutor, request.getNewAvailabilities());
    }
    
    /**
     * Handle "recurring" mode - ảnh hưởng toàn bộ recurring pattern
     * 
     * Logic:
     * 1. Đánh dấu tất cả old availabilities là DELETED
     * 2. Tạo new availabilities (thường với effectiveEndDate = null)
     */
    private void handleRecurringMode(Tutor tutor, BulkUpdateAvailabilityRequest request) {
        log.info("Handling 'recurring' mode");
        
        // 1. Mark old availabilities as DELETED
        if (request.getOldAvailabilityIds() != null && !request.getOldAvailabilityIds().isEmpty()) {
            // Security check
            List<TutorAvailability> oldAvailabilities = availabilityRepository
                    .findByIdInAndTutorId(request.getOldAvailabilityIds(), tutor.getId());
            
            if (oldAvailabilities.size() != request.getOldAvailabilityIds().size()) {
                throw new IllegalArgumentException("Some availability IDs do not belong to this tutor");
            }
            
            // Set status = DELETED instead of hard delete (để giữ lịch sử)
            for (TutorAvailability old : oldAvailabilities) {
                old.setStatus(AvailabilityStatus.DELETED);
            }
            availabilityRepository.saveAll(oldAvailabilities);
            log.info("Marked {} availabilities as DELETED", oldAvailabilities.size());
        }
        
        // 2. Create new availabilities
        createNewAvailabilities(tutor, request.getNewAvailabilities());
    }
    
    /**
     * Tạo new availabilities từ input list
     */
    private void createNewAvailabilities(Tutor tutor, List<AvailabilityInput> inputs) {
        if (inputs == null || inputs.isEmpty()) {
            log.info("No new availabilities to create");
            return;
        }
        
        List<TutorAvailability> newAvailabilities = new ArrayList<>();
        
        for (AvailabilityInput input : inputs) {
            TutorAvailability availability = TutorAvailability.builder()
                    .tutor(tutor)
                    .dayOfWeek(input.getDayOfWeek().shortValue())
                    .startTime(LocalTime.parse(input.getStartTime(), TIME_FORMATTER))
                    .endTime(LocalTime.parse(input.getEndTime(), TIME_FORMATTER))
                    .effectiveStartDate(input.getEffectiveStartDate())
                    .effectiveEndDate(input.getEffectiveEndDate())
                    .status(input.getStatus())
                    .build();
            
            newAvailabilities.add(availability);
        }
        
        availabilityRepository.saveAll(newAvailabilities);
        log.info("Created {} new availabilities", newAvailabilities.size());
    }
}
