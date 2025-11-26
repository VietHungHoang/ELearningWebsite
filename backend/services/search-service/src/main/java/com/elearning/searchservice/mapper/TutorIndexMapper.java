package com.elearning.searchservice.mapper;

import com.elearning.searchservice.dto.event.TutorIndexEvent;
import com.elearning.searchservice.entity.TutorDocument;
import org.springframework.stereotype.Component;

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
                
                // Multi-language name
                .nameVi(event.getNameVi())
                .nameEn(event.getNameEn())
                .nameJa(event.getNameJa())
                .nameViAutocomplete(event.getNameVi())
                .nameEnAutocomplete(event.getNameEn())
                .nameJaAutocomplete(event.getNameJa())
                
                // Multi-language bio
                .bioVi(event.getBioVi())
                .bioEn(event.getBioEn())
                .bioJa(event.getBioJa())
                
                // Multi-language specialization
                .specializationVi(event.getSpecializationVi())
                .specializationEn(event.getSpecializationEn())
                .specializationJa(event.getSpecializationJa())
                
                // Multi-language headline
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
                .responseRate(event.getResponseRate())
                .completionRate(event.getCompletionRate())
                
                // Metadata
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .lastActiveAt(event.getLastActiveAt())
                
                .build();
    }
}
