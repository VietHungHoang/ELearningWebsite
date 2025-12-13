package com.elearning.tutorservice.mapper;

import com.elearning.tutorservice.dto.embedded.*;
import com.elearning.tutorservice.dto.event.TutorIndexEvent;
import com.elearning.tutorservice.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Maps Tutor entity to TutorIndexEvent for search indexing
 */
@Component
@RequiredArgsConstructor
public class TutorIndexEventMapper {

    /**
     * Map Tutor entity to TutorIndexEvent
     */
    public TutorIndexEvent toEvent(Tutor tutor, String eventType) {
        if (tutor == null) {
            return null;
        }

        return TutorIndexEvent.builder()
                .eventType(eventType)
                .timestamp(LocalDateTime.now().toString())
                .tutorId(tutor.getId())

                // Basic info
                .isVerified(tutor.getIsVerified())
                .isActive(true) // Assume active if exists

                // Use fullName for all languages (fallback)
                .nameVi(tutor.getFullName())
                .nameEn(tutor.getFullName())
                .nameJa(tutor.getFullName())

                // Use introduction as bio
                .bioVi(tutor.getIntroduction())
                .bioEn(tutor.getIntroduction())
                .bioJa(tutor.getIntroduction())

                // Use headline for specialization
                .specializationVi(tutor.getHeadline())
                .specializationEn(tutor.getHeadline())
                .specializationJa(tutor.getHeadline())

                // Use headline for headline
                .headlineVi(tutor.getHeadline())
                .headlineEn(tutor.getHeadline())
                .headlineJa(tutor.getHeadline())

                // Nested objects - simplified
                .subjects(mapSubjects(tutor.getSubjects()))
                .languages(mapLanguages(tutor.getLanguages()))
                .categories(List.of()) // TODO: implement when category entity available
                .education(mapEducation(tutor.getCertifications()))
                .experience(mapExperience(tutor.getCareerEntries()))
                .activeClasses(List.of()) // TODO: implement when class entity available

                // Filter fields
                .languageCodes(tutor.getLanguages() != null ?
                    tutor.getLanguages().stream()
                        .map(TutorLanguage::getCode)
                        .collect(Collectors.toList()) : List.of())
                .categoryIds(tutor.getSubjects() != null ?
                    tutor.getSubjects().stream()
                        .map(TutorSubject::getCategoryId)
                        .distinct()
                        .collect(Collectors.toList()) : List.of())
                .subjectIds(List.of()) // TODO: implement when subject entity available
                .nationalityCode(tutor.getCountryCode())

                // Numeric fields
                .currentSessionFee(tutor.getCurrentSessionFee())
                .currency(null)
                .sessionDurationMinutes(null)
                .averageRating(0.0) // TODO: calculate from reviews
                .totalReviews(tutor.getReviews() != null ? tutor.getReviews().size() : 0)
                .totalStudents(0) // TODO: implement
                .totalHoursTaught(0.0) // TODO: implement
                .yearsOfExperience(0) // TODO: calculate from career entries

                // Boolean filters
                .teachesInGroups(null)
                .hasVideo(tutor.getVideoUrl() != null && !tutor.getVideoUrl().isEmpty())
                .hasTrialLesson(false) // TODO: implement
                .availableNow(false) // TODO: implement based on availability

                // Availability
                .availableDays(List.of()) // TODO: implement from TutorAvailability
                .timezone(tutor.getTimezone())

                // Ranking signals - default values
                .popularityScore(0.0)
                .responseRate(0.0)
                .completionRate(0.0)

                // Metadata
                .createdAt(tutor.getCreatedAt())
                .updatedAt(tutor.getUpdatedAt())
                .lastActiveAt(tutor.getUpdatedAt())

                .build();
    }

    private List<SubjectInfo> mapSubjects(List<TutorSubject> tutorSubjects) {
        if (tutorSubjects == null) return List.of();

        return tutorSubjects.stream()
                .map(ts -> SubjectInfo.builder()
                        .id(null) // No subject entity, use categoryId as placeholder
                        .nameVi(ts.getSubjectName())
                        .nameEn(ts.getSubjectName())
                        .nameJa(ts.getSubjectName())
                        .categoryId(ts.getCategoryId())
                        .build())
                .collect(Collectors.toList());
    }

    private List<LanguageInfo> mapLanguages(List<TutorLanguage> tutorLanguages) {
        if (tutorLanguages == null) return List.of();

        return tutorLanguages.stream()
                .map(tl -> LanguageInfo.builder()
                        .code(tl.getCode())
                        .nameVi(tl.getCode()) // Use code as name fallback
                        .nameEn(tl.getCode())
                        .nameJa(tl.getCode())
                        .build())
                .collect(Collectors.toList());
    }

    private List<EducationInfo> mapEducation(List<Certification> certifications) {
        if (certifications == null) return List.of();

        return certifications.stream()
                .map(cert -> EducationInfo.builder()
                        .titleVi(cert.getName())
                        .titleEn(cert.getName())
                        .titleJa(cert.getName())
                        .institution(cert.getIssuingOrganization())
                        .graduationYear(cert.getIssueDate() != null ? cert.getIssueDate().getYear() : null)
                        .build())
                .collect(Collectors.toList());
    }

    private List<ExperienceInfo> mapExperience(List<CareerEntry> careerEntries) {
        if (careerEntries == null) return List.of();

        return careerEntries.stream()
                .filter(entry -> "EXPERIENCE".equals(entry.getType())) // Only experience entries
                .map(entry -> ExperienceInfo.builder()
                        .titleVi(entry.getTitle())
                        .titleEn(entry.getTitle())
                        .titleJa(entry.getTitle())
                        .company(entry.getInstitution())
                        .years(entry.getStartDate() != null && entry.getEndDate() != null ?
                            entry.getEndDate().getYear() - entry.getStartDate().getYear() : 0)
                        .build())
                .collect(Collectors.toList());
    }
}