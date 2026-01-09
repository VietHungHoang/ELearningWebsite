package com.elearning.tutorservice.mapper;

import com.elearning.tutorservice.dto.response.*;
import com.elearning.tutorservice.entity.Tutor;
import com.elearning.tutorservice.entity.TutorAvailability;
import com.elearning.tutorservice.entity.TutorOnboarding;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class TutorMapper {

    private Double calculateAverageRating(Tutor tutor) {
        if (tutor.getReviews() == null || tutor.getReviews().isEmpty()) {
            return null;
        }
        return tutor.getReviews().stream()
                .mapToDouble(review -> review.getRating() != null ? review.getRating().doubleValue() : 0.0)
                .average()
                .orElse(0.0);
    }

    private List<TutorLanguageResponse> mapLanguages(Tutor tutor) {
        if (tutor.getLanguages() == null) {
            return null;
        }
        return tutor.getLanguages().stream()
                .map(lang -> TutorLanguageResponse.builder()
                        .code(lang.getCode())
                        .isNative(lang.getIsNative())
                        .build())
                .collect(Collectors.toList());
    }

    private List<UUID> mapSubjectIds(Tutor tutor) {
        if (tutor.getSubjects() == null) {
            return null;
        }
        return tutor.getSubjects().stream()
                .map(subject -> subject.getSubjectId())
                .collect(Collectors.toList());
    }

    private List<TutorReviewResponse> mapReviews(Tutor tutor) {
        if (tutor.getReviews() == null) {
            return null;
        }
        return tutor.getReviews().stream()
                .map(review -> TutorReviewResponse.builder()
                        .id(review.getId())
                        .studentId(review.getStudentId())
                        .studentName(review.getStudentName())
                        .studentAvatarUrl(review.getStudentAvatarUrl())
                        .rating(review.getRating())
                        .comment(review.getComment())
                        .createdAt(review.getCreatedAt())
                        // Moderation fields
                        .moderationStatus(review.getModerationStatus())
                        .statusDescription(review.getModerationStatus() != null
                                ? review.getModerationStatus().getDescription()
                                : null)
                        .errorCode(review.getViolationCode())
                        .errorMessage(review.getViolationReason())
                        .build())
                .collect(Collectors.toList());
    }

    public TutorResponse toTutorResponse(Tutor tutor) {
        if (tutor == null) {
            return null;
        }

        return TutorResponse.builder()
                .id(tutor.getId())
                .fullName(tutor.getFullName())
                .email(tutor.getEmail())
                .isVerified(tutor.getIsVerified())
                .headline(tutor.getHeadline())
                .introduction(tutor.getIntroduction())
                .countryCode(tutor.getCountryCode())
                .avatarUrl(tutor.getAvatarUrl())
                .videoUrl(tutor.getVideoUrl())
                .currentSessionFee(tutor.getCurrentSessionFee())
                .originalSessionFee(tutor.getOriginalSessionFee())
                .averageRating(calculateAverageRating(tutor))
                .reviews(mapReviews(tutor))
                .bookedSessionsCount(tutor.getBookedSessionCount())
                .studentCount(tutor.getTotalStudents())
                .languageCodes(mapLanguages(tutor))
                .subjectIds(mapSubjectIds(tutor))
                .socialLinks(mapSocialLinks(tutor))
                .educations(mapEducations(tutor))
                .experiences(mapExperiences(tutor))
                .certificates(mapCertifications(tutor))
                .createdAt(tutor.getCreatedAt())
                .build();
    }

    public AvailabilityResponse toAvailabilityResponse(TutorAvailability availability) {
        if (availability == null) {
            return null;
        }
        return AvailabilityResponse.builder()
                .id(availability.getId())
                .dayOfWeek(availability.getDayOfWeek().intValue())
                .startTime(availability.getStartTime().toString())
                .endTime(availability.getEndTime().toString())
                .effectiveStartDate(availability.getEffectiveStartDate())
                .effectiveEndDate(availability.getEffectiveEndDate())
                .build();
    }

    private List<AvailabilityResponse> mapAvailabilities(Tutor tutor) {
        if (tutor.getAvailabilities() == null) {
            return null;
        }
        return tutor.getAvailabilities().stream()
                .map(availability -> AvailabilityResponse.builder()
                        .id(availability.getId())
                        .dayOfWeek(availability.getDayOfWeek().intValue())
                        .startTime(availability.getStartTime().toString())
                        .endTime(availability.getEndTime().toString())
                        .effectiveStartDate(availability.getEffectiveStartDate())
                        .effectiveEndDate(availability.getEffectiveEndDate())
                        .build())
                .collect(Collectors.toList());
    }

    private List<TutorSocialResponse> mapSocialLinks(Tutor tutor) {
        if (tutor.getSocialLinks() == null) {
            return null;
        }
        return tutor.getSocialLinks().stream()
                .map(social -> TutorSocialResponse.builder()
                        .id(social.getId())
                        .platform(social.getPlatform())
                        .url(social.getUrl())
                        .build())
                .collect(Collectors.toList());
    }

    private List<CareerEntryResponse> mapEducations(Tutor tutor) {
        if (tutor.getCareerEntries() == null) {
            return null;
        }
        return tutor.getCareerEntries().stream()
                .filter(entry -> "EDUCATION".equalsIgnoreCase(entry.getType()))
                .map(entry -> CareerEntryResponse.builder()
                        .id(entry.getId())
                        .type(entry.getType())
                        .title(entry.getTitle())
                        .institution(entry.getInstitution())
                        .startDate(entry.getStartDate())
                        .endDate(entry.getEndDate())
                        .location(entry.getLocation())
                        .description(entry.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    private List<CareerEntryResponse> mapExperiences(Tutor tutor) {
        if (tutor.getCareerEntries() == null) {
            return null;
        }
        return tutor.getCareerEntries().stream()
                .filter(entry -> "EXPERIENCE".equalsIgnoreCase(entry.getType()))
                .map(entry -> CareerEntryResponse.builder()
                        .id(entry.getId())
                        .type(entry.getType())
                        .title(entry.getTitle())
                        .institution(entry.getInstitution())
                        .startDate(entry.getStartDate())
                        .endDate(entry.getEndDate())
                        .location(entry.getLocation())
                        .description(entry.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    private List<CertificationResponse> mapCertifications(Tutor tutor) {
        if (tutor.getCertifications() == null) {
            return null;
        }
        return tutor.getCertifications().stream()
                .map(cert -> CertificationResponse.builder()
                        .id(cert.getId())
                        .name(cert.getName())
                        .issuingOrganization(cert.getIssuingOrganization())
                        .issueDate(cert.getIssueDate())
                        .expirationDate(cert.getExpirationDate())
                        .credentialId(cert.getCredentialId())
                        .credentialUrl(cert.getCredentialUrl())
                        .build())
                .collect(Collectors.toList());
    }

    public TutorProfileResponse toTutorProfileResponse(Tutor tutor) {
        if (tutor == null) {
            return null;
        }

        return TutorProfileResponse.builder()
                .id(tutor.getId())
                .isVerified(tutor.getIsVerified())
                .introduction(tutor.getIntroduction())
                .specialization(tutor.getHeadline()) // Using headline as specialization
                .nationalityCode(tutor.getCountryCode())
                .videoUrl(tutor.getVideoUrl())
                .videoThumbnailUrl(null) // Not available in entity
                .currentSessionFee(tutor.getCurrentSessionFee())
                .previousSessionFee(tutor.getOriginalSessionFee())
                .sessionDurationMinutes(60) // Default value
                .currency("USD") // Default value
                .teachesInGroups(false) // Default value
                .maxGroupMembers(null) // Not available
                .timezoneOffset(tutor.getTimezone())
                .languages(mapTutorLanguages(tutor))
                .socialLinks(mapTutorSocialLinks(tutor))
                .subjects(mapTutorSubjects(tutor))
                .careerEntries(mapTutorCareerEntries(tutor))
                .certifications(mapTutorCertifications(tutor))
                .build();
    }

    private List<TutorLanguageResponse> mapTutorLanguages(Tutor tutor) {
        if (tutor.getLanguages() == null) {
            return null;
        }
        return tutor.getLanguages().stream()
                .map(lang -> TutorLanguageResponse.builder()
                        .code(lang.getCode())
                        .isNative(lang.getIsNative())
                        .build())
                .collect(Collectors.toList());
    }

    private List<TutorSocialResponse> mapTutorSocialLinks(Tutor tutor) {
        if (tutor.getSocialLinks() == null) {
            return null;
        }
        return tutor.getSocialLinks().stream()
                .map(social -> TutorSocialResponse.builder()
                        .id(social.getId())
                        .platform(social.getPlatform())
                        .url(social.getUrl())
                        .build())
                .collect(Collectors.toList());
    }

    private List<TutorSubjectResponse> mapTutorSubjects(Tutor tutor) {
        if (tutor.getSubjects() == null) {
            return null;
        }
        return tutor.getSubjects().stream()
                .map(subject -> TutorSubjectResponse.builder()
                        .id(subject.getId())
                        .subjectId(subject.getSubjectId())
                        .subjectName(null) // Will be fetched from common-service if needed
                        .categoryId(null) // Not used anymore
                        .categoryName(null)
                        .build())
                .collect(Collectors.toList());
    }

    private List<CareerEntryResponse> mapTutorCareerEntries(Tutor tutor) {
        if (tutor.getCareerEntries() == null) {
            return null;
        }
        return tutor.getCareerEntries().stream()
                .map(entry -> CareerEntryResponse.builder()
                        .id(entry.getId())
                        .type(entry.getType())
                        .title(entry.getTitle())
                        .institution(entry.getInstitution())
                        .startDate(entry.getStartDate())
                        .endDate(entry.getEndDate())
                        .location(entry.getLocation())
                        .description(entry.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    private List<CertificationResponse> mapTutorCertifications(Tutor tutor) {
        if (tutor.getCertifications() == null) {
            return null;
        }
        return tutor.getCertifications().stream()
                .map(cert -> CertificationResponse.builder()
                        .id(cert.getId())
                        .name(cert.getName())
                        .issuingOrganization(cert.getIssuingOrganization())
                        .issueDate(cert.getIssueDate())
                        .expirationDate(cert.getExpirationDate())
                        .credentialId(cert.getCredentialId())
                        .credentialUrl(cert.getCredentialUrl())
                        .build())
                .collect(Collectors.toList());
    }

    public OnboardingResponse toOnboardingResponse(TutorOnboarding onboarding) {
        if (onboarding == null) {
            return null;
        }

        return OnboardingResponse.builder()
                .id(onboarding.getTutorId())
                .currentStep(onboarding.getCurrentStep())
                .jsonData(onboarding.getJsonData())
                .status(onboarding.getStatus() != null ? onboarding.getStatus().name() : null)
                .description(onboarding.getDescription())
                .createdAt(onboarding.getCreatedAt())
                .updatedAt(onboarding.getUpdatedAt())
                .build();
    }

    public UserInfoResponse toUserInfoResponse(Tutor tutor) {
        return UserInfoResponse.builder()
                .id(tutor.getId())
                .email(tutor.getEmail())
                .fullName(tutor.getFullName())
                .avatarUrl(tutor.getAvatarUrl())
                .build();
    }
}