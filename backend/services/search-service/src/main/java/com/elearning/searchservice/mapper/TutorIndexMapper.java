package com.elearning.searchservice.mapper;

import com.elearning.searchservice.dto.event.TutorIndexEvent;
import com.elearning.searchservice.entity.TutorDocument;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Mapper to convert TutorIndexEvent to TutorDocument for Elasticsearch indexing
 */
@Component
public class TutorIndexMapper {

    /**
     * Map event to document
     */
    public TutorDocument toDocument(TutorIndexEvent event) {
        if (event == null) {
            return null;
        }

        return TutorDocument.builder()
                // Basic info
                .id(event.getTutorId())
                .isVerified(event.getIsVerified())
                .isActive(event.getIsActive())
                .countryCode(event.getCountryCode())

                // Full name
                .fullNameVi(event.getFullNameVi())
                .fullNameEn(event.getFullNameEn())
                .fullNameJa(event.getFullNameJa())
                .fullNameViAutocomplete(event.getFullNameVi())
                .fullNameEnAutocomplete(event.getFullNameEn())
                .fullNameJaAutocomplete(event.getFullNameJa())

                // Introduction
                .introductionVi(event.getIntroductionVi())
                .introductionEn(event.getIntroductionEn())
                .introductionJa(event.getIntroductionJa())

                // Headline
                .headlineVi(event.getHeadlineVi())
                .headlineEn(event.getHeadlineEn())
                .headlineJa(event.getHeadlineJa())

                // Nested objects
                .subjects(event.getSubjects())
                .languages(event.getLanguages())
                .categories(event.getCategories())
                .education(event.getEducation())
                .experience(event.getExperience())
                .activeClasses(event.getActiveClasses())

                // Filter fields
                .languageCodes(event.getLanguageCodes())
                .categoryIds(event.getCategoryIds())
                .subjectIds(event.getSubjectIds())
                .nationalityCode(event.getNationalityCode())

                // Numeric fields
                .currentSessionFee(event.getCurrentSessionFee())
                .currency(event.getCurrency())
                .sessionDurationMinutes(event.getSessionDurationMinutes())
                .averageRating(event.getAverageRating())
                .totalReviews(event.getTotalReviews())
                .totalStudents(event.getTotalStudents())
                .totalHoursTaught(event.getTotalHoursTaught())
                .yearsOfExperience(event.getYearsOfExperience())

                // Boolean filters
                .teachesInGroups(event.getTeachesInGroups())
                .hasVideo(event.getHasVideo())
                .hasTrialLesson(event.getHasTrialLesson())
                .availableNow(event.getAvailableNow())

                // Availability
                .availableDays(event.getAvailableDays())
                .timezone(event.getTimezone())

                // Ranking signals
                .popularityScore(event.getPopularityScore())

                // Autocomplete
                .suggest(buildSuggestions(event))

                // Metadata
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .lastActiveAt(event.getLastActiveAt())

                .build();
    }

    private org.springframework.data.elasticsearch.core.suggest.Completion buildSuggestions(TutorIndexEvent event) {
        List<String> inputs = new ArrayList<>();

        // 1. Add inputs from Tutor Service (Name, Headline, Experience, etc.)
        if (event.getSuggestionInputs() != null) {
            inputs.addAll(event.getSuggestionInputs());
        }

        // 2. Add Category Names (from Search Service extraction)
        if (event.getCategories() != null) {
            event.getCategories().forEach(c -> {
                addIfPresent(inputs, c.getNameVi());
                addIfPresent(inputs, c.getNameEn());
            });
        }

        // 3. Add Subject Names (from Search Service extraction)
        if (event.getSubjects() != null) {
            event.getSubjects().forEach(s -> {
                addIfPresent(inputs, s.getNameVi());
                addIfPresent(inputs, s.getNameEn());
            });
        }

        if (inputs.isEmpty()) {
            return null;
        }

        return new org.springframework.data.elasticsearch.core.suggest.Completion(inputs.toArray(new String[0]));
    }

    private void addIfPresent(List<String> inputs, String value) {
        if (value != null && !value.trim().isEmpty()) {
            String trimmed = value.trim();
            if (!inputs.contains(trimmed)) {
                inputs.add(trimmed);
            }
        }
    }
}
