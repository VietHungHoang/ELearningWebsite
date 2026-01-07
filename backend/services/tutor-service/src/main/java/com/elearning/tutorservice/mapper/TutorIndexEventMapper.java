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
                                .countryCode(tutor.getCountryCode())

                                // Use fullName for all languages (fallback)
                                .fullNameVi(tutor.getFullName())
                                .fullNameEn(tutor.getFullName())
                                .fullNameJa(tutor.getFullName())

                                // Use introduction as introduction
                                .introductionVi(tutor.getIntroduction())
                                .introductionEn(tutor.getIntroduction())
                                .introductionJa(tutor.getIntroduction())

                                // Use headline for headline
                                .headlineVi(tutor.getHeadline())
                                .headlineEn(tutor.getHeadline())
                                .headlineJa(tutor.getHeadline())

                                // Nested objects - simplified
                                .subjects(mapSubjects(tutor.getSubjects()))
                                .languages(mapLanguages(tutor.getLanguages()))
                                .categories(List.of()) // Will be populated by CategorySubjectSyncScheduler
                                .education(mapEducation(tutor.getCareerEntries()))
                                .experience(mapExperience(tutor.getCareerEntries()))
                                .activeClasses(List.of()) // TODO: implement when class entity available

                                // Filter fields
                                .languageCodes(tutor.getLanguages() != null ? tutor.getLanguages().stream()
                                                .map(TutorLanguage::getCode)
                                                .collect(Collectors.toList()) : List.of())
                                .categoryIds(List.of()) // Will be populated by CategorySubjectSyncScheduler from
                                                        // subjects' categoryIds
                                .subjectIds(tutor.getSubjects() != null ? tutor.getSubjects().stream()
                                                .map(TutorSubject::getSubjectId)
                                                .distinct()
                                                .collect(Collectors.toList()) : List.of())
                                .nationalityCode(tutor.getCountryCode())

                                // Numeric fields - with defaults
                                .currentSessionFee(tutor.getCurrentSessionFee() != null ? tutor.getCurrentSessionFee()
                                                : java.math.BigDecimal.ZERO)
                                .currency(null)
                                .sessionDurationMinutes(tutor.getCurrentSessionFee().intValue())
                                .averageRating(0.0) // TODO: calculate from reviews
                                .totalReviews(tutor.getReviews() != null ? tutor.getReviews().size() : 0)
                                .totalStudents(tutor.getTotalStudents() != null ? tutor.getTotalStudents() : 0)
                                .totalHoursTaught(0.0) // TODO: implement
                                .yearsOfExperience(0) // TODO: calculate from career entries

                                // Boolean filters
                                .teachesInGroups(null)
                                .hasVideo(tutor.getVideoUrl() != null && !tutor.getVideoUrl().isEmpty())
                                .hasTrialLesson(false) // TODO: implement
                                .availableNow(false) // TODO: implement based on availability

                                // Availability - map from TutorAvailability entities
                                .availableDays(mapAvailableDays(tutor.getAvailabilities()))
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

        /**
         * Map TutorAvailability entities to availableDays format for ES
         * Format: "MONDAY_MORNING", "TUESDAY_AFTERNOON", "WEDNESDAY_EVENING"
         */
        private List<String> mapAvailableDays(List<TutorAvailability> availabilities) {
                if (availabilities == null || availabilities.isEmpty()) {
                        return List.of();
                }

                // Day of week names (1 = Monday, 7 = Sunday)
                String[] dayNames = { "", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY",
                                "SUNDAY" };

                return availabilities.stream()
                                .filter(a -> a.getEffectiveEndDate() == null) // Only current (open-ended)
                                                                              // availabilities
                                .map(a -> {
                                        String dayName = a.getDayOfWeek() >= 1 && a.getDayOfWeek() <= 7
                                                        ? dayNames[a.getDayOfWeek()]
                                                        : "UNKNOWN";
                                        String timeSlot = getTimeSlot(a.getStartTime());
                                        return dayName + "_" + timeSlot;
                                })
                                .distinct()
                                .collect(Collectors.toList());
        }

        /**
         * Determine time slot (MORNING, AFTERNOON, EVENING) from start time
         */
        private String getTimeSlot(java.time.LocalTime startTime) {
                if (startTime == null)
                        return "MORNING";

                int hour = startTime.getHour();
                if (hour < 12) {
                        return "MORNING";
                } else if (hour < 17) {
                        return "AFTERNOON";
                } else {
                        return "EVENING";
                }
        }

        private List<SubjectInfo> mapSubjects(List<TutorSubject> tutorSubjects) {
                if (tutorSubjects == null)
                        return List.of();

                return tutorSubjects.stream()
                                .map(ts -> SubjectInfo.builder()
                                                .id(ts.getSubjectId())
                                                .nameVi(null) // Will be fetched from common-service
                                                .nameEn(null)
                                                .nameJa(null)
                                                .categoryId(null) // Not used anymore
                                                .build())
                                .collect(Collectors.toList());
        }

        private List<LanguageInfo> mapLanguages(List<TutorLanguage> tutorLanguages) {
                if (tutorLanguages == null)
                        return List.of();

                return tutorLanguages.stream()
                                .map(tl -> LanguageInfo.builder()
                                                .code(tl.getCode())
                                                .nameVi(tl.getCode()) // Use code as name fallback
                                                .nameEn(tl.getCode())
                                                .nameJa(tl.getCode())
                                                .build())
                                .collect(Collectors.toList());
        }

        private List<EducationInfo> mapEducation(List<CareerEntry> careerEntries) {
                if (careerEntries == null)
                        return List.of();

                return careerEntries.stream()
                                .filter(entry -> "EDUCATION".equals(entry.getType()))
                                .map(edu -> EducationInfo.builder()
                                                .titleVi(edu.getTitle())
                                                .titleEn(edu.getTitle())
                                                .titleJa(edu.getTitle())
                                                .institution(edu.getInstitution())
                                                .graduationYear(edu.getEndDate() != null
                                                                ? edu.getEndDate().getYear()
                                                                : null)
                                                .build())
                                .collect(Collectors.toList());
        }

        private List<ExperienceInfo> mapExperience(List<CareerEntry> careerEntries) {
                if (careerEntries == null)
                        return List.of();

                return careerEntries.stream()
                                .filter(entry -> "EXPERIENCE".equals(entry.getType())) // Only experience entries
                                .map(entry -> ExperienceInfo.builder()
                                                .titleVi(entry.getTitle())
                                                .titleEn(entry.getTitle())
                                                .titleJa(entry.getTitle())
                                                .company(entry.getInstitution())
                                                .years(entry.getStartDate() != null && entry.getEndDate() != null
                                                                ? entry.getEndDate().getYear()
                                                                                - entry.getStartDate().getYear()
                                                                : 0)
                                                .build())
                                .collect(Collectors.toList());
        }
}