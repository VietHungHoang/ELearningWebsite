package com.elearning.bffservice.mapper;

import com.elearning.bffservice.bff.tutors.request.TutorSearchBffRequest;
import com.elearning.bffservice.bff.tutors.response.TutorBffResponse;
import com.elearning.bffservice.bff.tutors.response.TutorDetailBffResponse;
import com.elearning.bffservice.dto.classes.response.GroupClassResponse;
import com.elearning.bffservice.dto.request.SearchTutorRequest;
import com.elearning.bffservice.dto.tutor.response.TutorDetailResponse;
import com.elearning.bffservice.dto.tutor.response.TutorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Mapper for tutor search operations
 */
@Component
@Slf4j
public class TutorMapper {

    /**
     * Maps TutorSearchBffRequest to SearchTutorRequest for search service
     */
    public SearchTutorRequest mapToSearchTutorRequest(TutorSearchBffRequest request) {
        log.info("Mapping search request - keyword: {}, language: {}", request.getKeyword(), request.getLanguage());

        return SearchTutorRequest.builder()
                .keyword(request.getKeyword())
                .language(request.getLanguage())
                .languageCodes(request.getLanguageCodes())
                .minPrice(request.getMinPrice())
                .maxPrice(request.getMaxPrice())
                .categoryId(request.getCategoryId())
                .subjectId(request.getSubjectId())
                .classType(request.getClassType())
                .availableDays(request.getAvailableDays())
                .page(request.getPage())
                .size(request.getSize())
                .build();
    }

    /**
     * Maps TutorResponse to TutorBffResponse with additional stats
     */
    public TutorBffResponse mapToTutorBffResponse(TutorResponse tutor) {
        return TutorBffResponse.builder()
                .id(tutor.getId())
                .fullName(tutor.getFullName())
                .email(tutor.getEmail())
                .isVerified(tutor.getIsVerified())
                .introduction(tutor.getIntroduction())
                .headline(tutor.getHeadline())
                .countryCode(tutor.getCountryCode())
                .gender(tutor.getGender())
                .avatarUrl(tutor.getAvatarUrl())
                .timezone(tutor.getTimezone())
                .videoUrl(tutor.getVideoUrl())
                .currentSessionFee(tutor.getCurrentSessionFee())
                .originalSessionFee(tutor.getOriginalSessionFee())
                .averageRating(tutor.getAverageRating())
                .reviewCount(tutor.getReviewCount())
                .languageCodes(tutor.getLanguageCodes())
                .subjectIds(tutor.getSubjectIds())
                .bookedSessionsCount(tutor.getBookedSessionsCount())
                .studentCount(tutor.getStudentCount())
                .hasTrialSession(tutor.getHasTrialSession() == null || tutor.getHasTrialSession())
                .build();
    }

    /**
     * Maps TutorDetailResponse and GroupClassResponse list to
     * TutorDetailBffResponse
     */
    public TutorDetailBffResponse mapToTutorDetailBffResponse(TutorDetailResponse tutorDetail,
            List<GroupClassResponse> groupClasses) {
        return TutorDetailBffResponse.builder()
                .id(tutorDetail.getId())
                .fullName(tutorDetail.getFullName())
                .email(tutorDetail.getEmail())
                .isVerified(tutorDetail.getIsVerified())
                .introduction(tutorDetail.getIntroduction())
                .headline(tutorDetail.getHeadline())
                .countryCode(tutorDetail.getCountryCode())
                .gender(tutorDetail.getGender())
                .avatarUrl(tutorDetail.getAvatarUrl())
                .timezone(tutorDetail.getTimezone())
                .videoUrl(tutorDetail.getVideoUrl())
                .currentSessionFee(tutorDetail.getCurrentSessionFee())
                .originalSessionFee(tutorDetail.getOriginalSessionFee())
                .averageRating(tutorDetail.getAverageRating())
                .reviewCount(tutorDetail.getReviewCount())
                .languageCodes(tutorDetail.getLanguageCodes())
                .subjectIds(tutorDetail.getSubjectIds())
                .bookedSessionsCount(tutorDetail.getBookedSessionsCount())
                .studentCount(tutorDetail.getStudentCount())
                .hasTrialSession(tutorDetail.getHasTrialSession())
                .reviews(tutorDetail.getReviews())
                .availabilities(tutorDetail.getAvailabilities())
                .socialLinks(tutorDetail.getSocialLinks())
                .educations(tutorDetail.getEducations())
                .experiences(tutorDetail.getExperiences())
                .certifications(tutorDetail.getCertifications())
                .groupClasses(groupClasses)
                .build();
    }

}